// Verify MongoDB archive backup and restore using only temporary local databases.
const { randomBytes } = require('node:crypto');
const { spawn } = require('node:child_process');
const { MongoClient, ObjectId, BSON } = require('mongodb');
const path = require('node:path');

const root = path.resolve(__dirname, '../../..');
const suffix = randomBytes(8).toString('hex');
const sourceName = `chzzk_backup_test_${suffix}`;
const restoredName = `chzzk_restore_test_${suffix}`;
const uri = 'mongodb://127.0.0.1:27017';

function docker(args, input) {
  return new Promise((resolve, reject) => {
    const child = spawn('docker', ['compose', 'exec', '-T', 'mongodb', ...args], {
      cwd: root,
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });
    const output = [];
    const errors = [];
    child.stdout.on('data', (part) => output.push(part));
    child.stderr.on('data', (part) => errors.push(part));
    child.on('error', reject);
    child.on('close', (code) => code === 0
      ? resolve(Buffer.concat(output))
      : reject(new Error(`Docker command failed (${code}): ${Buffer.concat(errors).toString('utf8').trim()}`)));
    child.stdin.on('error', reject);
    child.stdin.end(input);
  });
}

async function snapshot(database) {
  const collections = await database.listCollections({}, { nameOnly: true }).toArray();
  const result = {};
  for (const { name } of collections.sort((a, b) => a.name.localeCompare(b.name))) {
    const collection = database.collection(name);
    result[name] = {
      documents: (await collection.find().sort({ _id: 1 }).toArray()).map((doc) => BSON.EJSON.stringify(doc)),
      indexes: (await collection.listIndexes().toArray()).map(({ name: indexName, key, unique, partialFilterExpression, expireAfterSeconds }) => ({
        name: indexName, key, unique: Boolean(unique), partialFilterExpression, expireAfterSeconds,
      })).sort((a, b) => a.name.localeCompare(b.name)),
    };
  }
  return result;
}

async function main() {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const source = client.db(sourceName);
  const restored = client.db(restoredName);
  try {
    const streamerId = new ObjectId();
    await source.collection('streamer').insertOne({ _id: streamerId, name: 'backup sample', chzzkLink: 'https://chzzk.naver.com/sample', isOfficial: false });
    await source.collection('schedule').insertOne({ streamerId, title: 'sample schedule', startAt: new Date('2026-11-20T12:00:00Z'), endAt: new Date('2026-11-20T13:00:00Z'), status: 'scheduled' });
    await source.collection('submissions').insertOne({ kind: 'schedule', status: 'approved', receiptToken: randomBytes(24).toString('hex'), reviewedBy: 'sample-reviewer', payload: { title: 'sample schedule' } });
    await source.collection('submissions').createIndex({ receiptToken: 1 }, { unique: true });
    await source.collection('submission_limits').insertOne({ key: 'sample-limit', count: 2, expiresAt: new Date('2026-11-20T12:00:00Z') });
    await source.collection('submission_limits').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await source.collection('admin_login_limits').insertOne({ key: 'sample-login', count: 1, expiresAt: new Date('2026-11-20T12:00:00Z') });
    await source.collection('admin_login_limits').createIndex({ key: 1 }, { unique: true });

    const before = await snapshot(source);
    const archive = await docker(['mongodump', '--quiet', '--archive', '--db', sourceName]);
    if (archive.length === 0) throw new Error('Backup archive is empty');
    await docker(['mongorestore', '--quiet', '--archive', '--nsFrom', `${sourceName}.*`, '--nsTo', `${restoredName}.*`], archive);
    const after = await snapshot(restored);
    if (BSON.EJSON.stringify(before) !== BSON.EJSON.stringify(after)) throw new Error('Restored documents or indexes differ from source');
    process.stdout.write(`Backup restore verified: ${Object.keys(after).length} collections, ${archive.length} archive bytes.\n`);
  } finally {
    if (!sourceName.startsWith('chzzk_backup_test_') || !restoredName.startsWith('chzzk_restore_test_')) throw new Error('Unsafe database name');
    await source.dropDatabase();
    await restored.dropDatabase();
    await client.close();
  }
}

main().catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
