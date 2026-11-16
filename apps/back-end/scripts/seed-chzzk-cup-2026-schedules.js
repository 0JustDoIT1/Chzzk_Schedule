// One-time, idempotent local seed from the 2026 CHZZK Cup official event page.
// Run with local DB_URI and DB_Name=Chzzk; pass --apply to write.
const { MongoClient } = require('mongodb');

const channelId = 'c42cd75ec4855a9edf204a407c3c1dd2';
const streamer = {
  name: '치지직 공식',
  chzzkLink: `https://chzzk.naver.com/${channelId}`,
  isOfficial: true,
};
const sourceUrl = 'https://chzzk.naver.com/event/chzzkcup2026';
const events = [
  ['2026-11-19', '팀 드래프트', '17:00'],
  ['2026-11-22', '풀리그 1일차'],
  ['2026-11-23', '풀리그 2일차'],
  ['2026-11-24', '풀리그 3일차'],
  ['2026-11-25', '풀리그 4일차'],
  ['2026-11-26', '풀리그 5일차'],
  ['2026-11-28', '그룹배틀 1일차'],
  ['2026-11-29', '그룹배틀 2일차'],
  ['2026-12-01', '플레이오프 진출전'],
  ['2026-12-05', '플레이오프 1일차'],
  ['2026-12-06', '플레이오프 2일차'],
];

function startOf([day, , time]) {
  return new Date(`${day}T${time ? time + ':00' : '00:00:00'}+09:00`);
}

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
      throw new Error('Official channel name or link conflicts with an existing streamer');
    }
    const existing = await schedules.find({ streamerName: streamer.name,
      startAt: { $gte: new Date('2026-11-18T15:00:00Z'), $lt: new Date('2026-12-06T15:00:00Z') } },
    { projection: { title: 1, startAt: 1 } }).toArray();
    const missing = events.filter((event) => !existing.some((row) =>
      row.title === `2026 치지직컵 ${event[1]}` && row.startAt.toISOString() === startOf(event).toISOString()));
    if (process.argv.includes('--apply')) {
      if (!conflicting) await streamers.insertOne(streamer);
      const saved = conflicting ?? await streamers.findOne({ name: streamer.name });
      if (missing.length) await schedules.insertMany(missing.map((event) => {
        const startAt = startOf(event);
        return {
          isOfficial: true, streamerName: streamer.name, streamerId: saved._id,
          chzzkLink: streamer.chzzkLink, category: 'official',
          title: `2026 치지직컵 ${event[1]}`,
          member: [], memberIds: [], fullDay: false, startTimeKnown: Boolean(event[2]),
          endTimeKnown: false, status: 'scheduled', startAt, endAt: startAt,
          sourceUrl, revisionHistory: [{ version: 1, sourceUrl,
            reviewedAt: new Date(), note: 'CHZZK official event page; unknown times left unknown', changedFields: [] }],
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

module.exports = { events, startOf };
