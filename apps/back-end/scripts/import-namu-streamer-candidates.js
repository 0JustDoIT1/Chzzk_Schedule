// Import wiki document titles into a private local staging collection.
// These are candidates, not published streamer records or scheduled broadcasts.
const { MongoClient } = require('mongodb');
const root = require('../data/namu-chzzk-streamer-candidates.json');
const subcategories = require('../data/namu-chzzk-subcategories.json');
const nestedTitles = require('../data/namu-chzzk-subcategory-titles.json');
const excluded = require('../data/excluded-namu-streamer-candidates.json');

function candidates() {
  const byTitle = new Map();
  const excludedTitles = new Set(excluded.titles);
  const categories = [
    { name: '치지직 스트리머', titles: root.titles },
    ...subcategories.categories.map(({ name, titles }) => ({ name, titles })),
    ...nestedTitles.categories.map(({ name, titles }) => ({ name, titles })),
  ];
  for (const category of categories) {
    for (const title of category.titles) {
      if (excludedTitles.has(title)) continue;
      if (!byTitle.has(title)) byTitle.set(title, []);
      byTitle.get(title).push(category.name);
    }
  }
  return [...byTitle].map(([title, categoryNames]) => ({ title, categories: categoryNames }));
}

async function main() {
  const uri = process.env.DB_URI;
  const dbName = process.env.DB_Name;
  if (!['mongodb://127.0.0.1:27017', 'mongodb://localhost:27017'].includes(uri) || dbName !== 'Chzzk') {
    throw new Error('This import is limited to the local Chzzk development database');
  }
  const rows = candidates();
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const collection = client.db(dbName).collection('streamer_candidate');
    const existing = new Set((await collection.find({ title: { $in: rows.map((row) => row.title) } },
      { projection: { title: 1 } }).toArray()).map((row) => row.title));
    const missing = rows.filter((row) => !existing.has(row.title));
    if (process.argv.includes('--apply')) {
      await collection.bulkWrite(rows.map((row) => ({ updateOne: {
        filter: { title: row.title },
        update: {
          $set: { categories: row.categories },
          $setOnInsert: { source: 'namu-wiki-category', status: 'unverified', importedAt: new Date() },
        },
        upsert: true,
      } })));
    }
    process.stdout.write(JSON.stringify({ candidates: rows.length, existing: existing.size,
      missing: missing.length, inserted: process.argv.includes('--apply') ? missing.length : 0 }) + '\n');
  } finally {
    await client.close();
  }
}

if (require.main === module) main().catch((error) => {
  process.stderr.write(`Import failed: ${error.message}\n`);
  process.exitCode = 1;
});

module.exports = { candidates };
