// Local development DB only. Dry run by default; --apply writes a rollback manifest first.
const { MongoClient, ObjectId } = require('mongodb');
const { randomBytes } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '../../..');
const backupDir = path.join(repoRoot, '.migration-backups');
const uri = process.env.DB_URI;
const dbName = process.env.DB_Name;
const apply = process.argv.includes('--apply');
const rollbackIndex = process.argv.indexOf('--rollback');

function channelId(link) {
  try {
    const url = new URL(link);
    if (url.protocol !== 'https:' || url.hostname !== 'chzzk.naver.com') return undefined;
    return /^\/([a-f0-9]{32})\/?$/i.exec(url.pathname)?.[1].toLowerCase();
  } catch {
    return undefined;
  }
}

async function main() {
  if (!['mongodb://127.0.0.1:27017', 'mongodb://localhost:27017'].includes(uri) || dbName !== 'Chzzk') {
    throw new Error('Only the local Chzzk development database is allowed');
  }
  if (apply && rollbackIndex !== -1) throw new Error('Choose either --apply or --rollback');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    const collection = client.db(dbName).collection('streamer');
    if (rollbackIndex !== -1) {
      const file = path.resolve(process.argv[rollbackIndex + 1] || '');
      if (!file.startsWith(`${backupDir}${path.sep}`)) throw new Error('Rollback manifest must be inside .migration-backups');
      const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (manifest.database !== dbName || !Array.isArray(manifest.items)) throw new Error('Invalid rollback manifest');
      let reverted = 0;
      for (const item of manifest.items) {
        const result = await collection.updateOne(
          { _id: new ObjectId(item.id), chzzkLink: item.link, channelId: item.channelId },
          { $unset: { channelId: '' } },
        );
        reverted += result.modifiedCount;
      }
      process.stdout.write(JSON.stringify({ reverted, expected: manifest.items.length }) + '\n');
      return;
    }

    const rows = await collection.find({}, { projection: { chzzkLink: 1, channelId: 1 } }).toArray();
    const seen = new Map();
    const missing = [];
    const conflicts = [];
    for (const row of rows) {
      const id = channelId(row.chzzkLink);
      if (!id) continue;
      if (seen.has(id) && seen.get(id) !== String(row._id)) conflicts.push(id);
      seen.set(id, String(row._id));
      if (row.channelId && row.channelId !== id) conflicts.push(id);
      if (!row.channelId) missing.push({ id: String(row._id), link: row.chzzkLink, channelId: id });
    }
    const summary = { total: rows.length, parseable: seen.size, missing: missing.length, conflicts: [...new Set(conflicts)].length };
    if (!apply) return process.stdout.write(JSON.stringify(summary) + '\n');
    if (conflicts.length) throw new Error(`Channel ID conflicts: ${summary.conflicts}`);
    if (missing.length === 0) return process.stdout.write(JSON.stringify({ ...summary, updated: 0 }) + '\n');

    fs.mkdirSync(backupDir, { recursive: true });
    const runId = randomBytes(8).toString('hex');
    const file = path.join(backupDir, `channel-id-${runId}.json`);
    fs.writeFileSync(file, JSON.stringify({ database: dbName, runId, items: missing }, null, 2), { flag: 'wx' });
    await collection.createIndex({ channelId: 1 }, { unique: true, sparse: true });
    let updated = 0;
    for (const item of missing) {
      const result = await collection.updateOne(
        { _id: new ObjectId(item.id), chzzkLink: item.link, channelId: { $exists: false } },
        { $set: { channelId: item.channelId } },
      );
      updated += result.modifiedCount;
    }
    process.stdout.write(JSON.stringify({ ...summary, updated, rollbackManifest: file }) + '\n');
    if (updated !== missing.length) throw new Error('Some rows were not updated; use the rollback manifest to inspect');
  } finally {
    await client.close();
  }
}

main().catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
