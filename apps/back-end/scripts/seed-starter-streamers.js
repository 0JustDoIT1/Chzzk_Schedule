// Verified channel links for the local development database only.
// Usage: DB_URI=mongodb://127.0.0.1:27017 DB_Name=Chzzk node scripts/seed-starter-streamers.js [--apply]
const { MongoClient } = require('mongodb');
const verified = require('../data/verified-chzzk-channels.json');

const starterStreamers = verified.channels.map(({ name, channelId }) => ({
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
