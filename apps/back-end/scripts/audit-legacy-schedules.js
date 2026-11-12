// Read-only inventory of possible participant-copy schedules.
// Usage: DB_URI=... DB_Name=... node scripts/audit-legacy-schedules.js
const { MongoClient } = require('mongodb');

function candidatePipeline() {
  return [
    { $group: {
      _id: { title: '$title', startAt: '$startAt' },
      count: { $sum: 1 },
      entries: { $push: {
        id: '$_id', streamerId: '$streamerId', streamerName: '$streamerName',
        member: '$member', memberIds: '$memberIds', endAt: '$endAt',
        category: '$category', isOfficial: '$isOfficial', chzzkLink: '$chzzkLink',
        sourceUrl: '$sourceUrl', contents: '$contents', updatedAt: '$updatedAt',
      } },
    } },
    { $match: { count: { $gt: 1 } } },
    { $sort: { '_id.startAt': -1 } },
  ];
}

async function main() {
  if (!process.env.DB_URI || !process.env.DB_Name) {
    throw new Error('DB_URI and DB_Name are required');
  }
  const client = new MongoClient(process.env.DB_URI, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const groups = await client.db(process.env.DB_Name).collection('schedule').aggregate(candidatePipeline()).toArray();
    // Same title and time may be unrelated events; each group needs manual review.
    process.stdout.write(JSON.stringify({ candidateGroups: groups.length, groups }, null, 2) + '\n');
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`Audit failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = { candidatePipeline };
