// One-time, idempotent local development seed from the CHZZK esports schedule.
// Run with DB_URI=mongodb://127.0.0.1:27017 DB_Name=Chzzk node scripts/seed-pubgm-upcoming-schedules.js [--apply]
const { MongoClient } = require('mongodb');

const channelId = 'de445eefe5915a0d7e9cbf98da6c9041';
const streamer = {
  name: 'PUBG MOBILE Esports KR',
  chzzkLink: `https://chzzk.naver.com/${channelId}`,
  isOfficial: false,
};
const sourceUrl = 'https://m.chzzk.naver.com/home/esports';
const events = [
  ['2026-11-26', 'The Gauntlet'],
  ['2026-11-27', 'The Gauntlet DAY 2'],
  ['2026-11-29', 'Group Stage Green DAY 1'],
  ['2026-11-30', 'Group Stage Green DAY 2'],
  ['2026-12-02', 'Group Stage Red DAY 1'],
  ['2026-12-03', 'Group Stage Red DAY 2'],
  ['2026-12-05', 'Last Chance DAY 1'],
  ['2026-12-06', 'Last Chance DAY 2'],
  ['2026-12-11', 'Grand Finals DAY 1'],
  ['2026-12-12', 'Grand Finals DAY 2'],
  ['2026-12-13', 'Grand Finals DAY 3'],
];

async function main() {
  if (!['mongodb://127.0.0.1:27017', 'mongodb://localhost:27017'].includes(process.env.DB_URI) ||
      process.env.DB_Name !== 'Chzzk') {
    throw new Error('This seed is limited to the local Chzzk development database');
  }
  const client = new MongoClient(process.env.DB_URI, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const db = client.db(process.env.DB_Name);
    const streamers = db.collection('streamer');
    const schedules = db.collection('schedule');
    const conflicting = await streamers.findOne({ $or: [
      { name: streamer.name }, { chzzkLink: streamer.chzzkLink },
    ] });
    if (conflicting && (conflicting.name !== streamer.name || conflicting.chzzkLink !== streamer.chzzkLink)) {
      throw new Error('Channel name or link conflicts with an existing streamer');
    }
    const existing = await schedules.find({ streamerName: streamer.name,
      startAt: { $gte: new Date('2026-11-26T00:00:00Z'), $lt: new Date('2026-12-14T00:00:00Z') } },
    { projection: { title: 1, startAt: 1 } }).toArray();
    const missing = events.filter(([day, title]) => !existing.some((row) =>
      row.title === title && row.startAt.toISOString() === `${day}T11:00:00.000Z`));
    if (process.argv.includes('--apply')) {
      if (!conflicting) await streamers.insertOne(streamer);
      const saved = conflicting ?? await streamers.findOne({ name: streamer.name });
      if (missing.length) await schedules.insertMany(missing.map(([day, title]) => {
        const startAt = new Date(`${day}T11:00:00.000Z`); // 20:00 KST
        return {
          isOfficial: false, streamerName: streamer.name, streamerId: saved._id,
          chzzkLink: streamer.chzzkLink, category: 'match', title,
          member: [], memberIds: [], fullDay: false, startTimeKnown: true,
          endTimeKnown: false, status: 'scheduled', startAt, endAt: startAt,
          sourceUrl, revisionHistory: [{ version: 1, sourceUrl,
            reviewedAt: new Date(), note: 'CHZZK esports listing; end time not announced', changedFields: [] }],
        };
      }));
    }
    console.log(JSON.stringify({ channelMissing: !conflicting, existing: existing.length,
      missing: missing.length, inserted: process.argv.includes('--apply') ? missing.length : 0 }));
  } finally {
    await client.close();
  }
}

if (require.main === module) main().catch((error) => {
  console.error(`Seed failed: ${error.message}`);
  process.exitCode = 1;
});

module.exports = { events };
