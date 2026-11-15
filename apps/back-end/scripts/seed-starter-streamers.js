// A small, idempotent starter list for the local development database only.
// Usage: DB_URI=mongodb://127.0.0.1:27017 DB_Name=Chzzk node scripts/seed-starter-streamers.js [--apply]
const { MongoClient } = require('mongodb');

const starterStreamers = [
  ['한동숙', '75cbf189b3bb8f9f687d2aca0d0a382b'],
  ['랄로', '3497a9a7221cc3ee5d3f95991d9f95e9'],
  ['침착맨', 'bb382c2c0cc9fa7c86ab3b037fb5799c'],
  ['탬탬버린', 'a7e175625fdea5a7d98428302b7aa57f'],
  ['아야츠노 유니', '45e71a76e949e16a34764deb962f9d9f'],
  ['풍월량', '7ce8032370ac5121dcabce7bad375ced'],
  ['다주', 'bdc57cc4217173f0e89f63fba2f1c6e5'],
].map(([name, channelId]) => ({
  name,
  chzzkLink: `https://chzzk.naver.com/${channelId}`,
  isOfficial: false,
}));

async function main() {
  const uri = process.env.DB_URI;
  const dbName = process.env.DB_Name;
  if (!['mongodb://127.0.0.1:27017', 'mongodb://localhost:27017'].includes(uri) || dbName !== 'Chzzk') {
    throw new Error('This seed is limited to the local Chzzk development database');
  }
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const collection = client.db(dbName).collection('streamer');
    const names = starterStreamers.map((item) => item.name);
    const links = starterStreamers.map((item) => item.chzzkLink);
    const existing = await collection.find({ $or: [{ name: { $in: names } }, { chzzkLink: { $in: links } }] },
      { projection: { name: 1, chzzkLink: 1 } }).toArray();
    for (const item of existing) {
      const expected = starterStreamers.find((candidate) => candidate.name === item.name);
      if (!expected || expected.chzzkLink !== item.chzzkLink) {
        throw new Error(`Existing streamer conflicts with starter list: ${item.name}`);
      }
    }
    const missing = starterStreamers.filter((item) => !existing.some((saved) => saved.name === item.name));
    if (process.argv.includes('--apply') && missing.length) await collection.insertMany(missing);
    process.stdout.write(JSON.stringify({ existing: existing.length, missing: missing.length,
      inserted: process.argv.includes('--apply') ? missing.length : 0, names: missing.map((item) => item.name) }) + '\n');
  } finally {
    await client.close();
  }
}

if (require.main === module) main().catch((error) => {
  process.stderr.write(`Seed failed: ${error.message}\n`);
  process.exitCode = 1;
});

module.exports = { starterStreamers };
