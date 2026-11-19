// Remove explicitly excluded titles from the private local candidate collection.
const { MongoClient, BSON } = require('mongodb');
const { mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const { resolve, join, basename } = require('node:path');
const { randomBytes } = require('node:crypto');
const excluded = require('../data/excluded-namu-streamer-candidates.json');

async function main() {
  if (!['mongodb://127.0.0.1:27017', 'mongodb://localhost:27017'].includes(process.env.DB_URI) ||
      process.env.DB_Name !== 'Chzzk') {
    throw new Error('This operation is limited to the local Chzzk development database');
  }
  const backupDir = resolve(__dirname, '../../../.migration-backups');
  const rollbackIndex = process.argv.indexOf('--rollback');
  const rollbackFile = rollbackIndex < 0 ? undefined : resolve(process.argv[rollbackIndex + 1] ?? '');
  if (rollbackFile && (resolve(rollbackFile, '..') !== backupDir ||
      !basename(rollbackFile).startsWith('excluded-candidates-'))) {
    throw new Error('Rollback file must be an excluded-candidates backup in .migration-backups');
  }
  if (rollbackFile && process.argv.includes('--apply')) throw new Error('Choose --apply or --rollback');
  const client = new MongoClient(process.env.DB_URI, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const collection = client.db('Chzzk').collection('streamer_candidate');
    if (rollbackFile) {
      const rows = BSON.EJSON.parse(readFileSync(rollbackFile, 'utf8'));
      if (!Array.isArray(rows) || rows.some((row) => !excluded.titles.includes(row.title))) {
        throw new Error('Backup contains an unexpected candidate');
      }
      const existing = await collection.countDocuments({ title: { $in: rows.map((row) => row.title) } });
      if (existing) throw new Error('Candidate already exists; rollback stopped');
      if (rows.length) await collection.insertMany(rows);
      console.log(JSON.stringify({ restored: rows.length }));
      return;
    }
    const rows = await collection.find({ title: { $in: excluded.titles } }).toArray();
    if (!process.argv.includes('--apply') || !rows.length) {
      console.log(JSON.stringify({ found: rows.length, removed: 0, titles: rows.map((row) => row.title) }));
      return;
    }
    mkdirSync(backupDir, { recursive: true });
    const backupFile = join(backupDir, `excluded-candidates-${Date.now()}-${randomBytes(4).toString('hex')}.json`);
    writeFileSync(backupFile, BSON.EJSON.stringify(rows, null, 2), { flag: 'wx' });
    const result = await collection.deleteMany({ _id: { $in: rows.map((row) => row._id) }, title: { $in: excluded.titles } });
    if (result.deletedCount !== rows.length) throw new Error('Removal count differs from backup; inspect the local DB');
    console.log(JSON.stringify({ found: rows.length, removed: result.deletedCount, backupFile }));
  } finally {
    await client.close();
  }
}

if (require.main === module) main().catch((error) => {
  console.error(`Candidate removal failed: ${error.message}`);
  process.exitCode = 1;
});
