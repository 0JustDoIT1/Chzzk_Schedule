// One-time local seed for upcoming broadcasts advertised on the CHZZK home page.
// Run with local DB_URI and DB_Name=Chzzk; pass --apply to write.
const { MongoClient } = require('mongodb');

const sourceUrl = 'https://chzzk.naver.com/';
const events = [
  {
    name: '개복어', channelId: '55e243bd868e55adf3524c85f8db51b5',
    title: '워독스 삼국개전 2기 스트리머 96인 대전',
    startAt: '2026-11-18T18:00:00+09:00', category: 'match',
    channelSource: 'https://www.semorank.kr/ranking/chzzk',
    eventSource: 'https://inbangmo.com/live-events/samguk-gaejeon-2',
  },
  {
    name: '우키팝', channelId: 'e137dc6f45461108f4e22d205f639218',
    title: '생방송 음악이 좋다 EP.03 김간지X우키팝의 음악계 소식',
    startAt: '2026-11-18T22:00:00+09:00', category: 'content',
    channelSource: 'https://inbangmo.com/viewership/streamer/chzzk/e137dc6f45461108f4e22d205f639218',
  },
  {
    name: '보이는 라디오볼', channelId: '96d54ad9945bd57c0bd1e7b3342f5985',
    title: '보이는 라디오볼 | 삼성 이승민 초대석',
    startAt: '2026-11-20T13:00:00+09:00', category: 'content',
    channelSource: 'https://auro.live/creator/chzzk/96d54ad9945bd57c0bd1e7b3342f5985',
  },
];

async function main() {
  if (!['mongodb://127.0.0.1:27017', 'mongodb://localhost:27017'].includes(process.env.DB_URI) ||
      process.env.DB_Name !== 'Chzzk') {
    throw new Error('This seed is limited to the local Chzzk development database');
  }
  const client = new MongoClient(process.env.DB_URI, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const db = client.db('Chzzk');
    const streamers = db.collection('streamer');
    const schedules = db.collection('schedule');
    const existingStreamers = await streamers.find({ $or: [
      { name: { $in: events.map((event) => event.name) } },
      { chzzkLink: { $in: events.map((event) => `https://chzzk.naver.com/${event.channelId}`) } },
    ] }).toArray();
    for (const row of existingStreamers) {
      const event = events.find((item) => item.name === row.name);
      if (!event || row.chzzkLink !== `https://chzzk.naver.com/${event.channelId}`) {
        throw new Error(`Channel name or link conflicts: ${row.name}`);
      }
    }
    const existingSchedules = await schedules.find({ title: { $in: events.map((event) => event.title) } },
      { projection: { title: 1, streamerName: 1, startAt: 1 } }).toArray();
    for (const row of existingSchedules) {
      const event = events.find((item) => item.title === row.title);
      if (row.streamerName !== event.name || row.startAt.toISOString() !== new Date(event.startAt).toISOString()) {
        throw new Error(`Schedule title conflicts: ${row.title}`);
      }
    }
    const missing = events.filter((event) => !existingSchedules.some((row) => row.title === event.title));
    if (process.argv.includes('--apply')) {
      const missingStreamers = events.filter((event) =>
        !existingStreamers.some((row) => row.name === event.name));
      if (missingStreamers.length) await streamers.insertMany(missingStreamers.map((event) => ({
        name: event.name, chzzkLink: `https://chzzk.naver.com/${event.channelId}`, isOfficial: false,
      })));
      const saved = await streamers.find({ name: { $in: events.map((event) => event.name) } }).toArray();
      if (missing.length) await schedules.insertMany(missing.map((event) => {
        const startAt = new Date(event.startAt);
        const owner = saved.find((row) => row.name === event.name);
        return {
          isOfficial: false, streamerName: event.name, streamerId: owner._id,
          chzzkLink: owner.chzzkLink, category: event.category, title: event.title,
          member: [], memberIds: [], fullDay: false, startTimeKnown: true,
          endTimeKnown: false, status: 'scheduled', startAt, endAt: startAt,
          sourceUrl, revisionHistory: [{ version: 1, sourceUrl,
            reviewedAt: new Date(), note: `CHZZK home promotion; channel: ${event.channelSource}; event: ${event.eventSource ?? sourceUrl}; end time unannounced`,
            changedFields: [] }],
        };
      }));
    }
    console.log(JSON.stringify({ channelMissing: events.length - existingStreamers.length,
      scheduleMissing: missing.length, inserted: process.argv.includes('--apply') ? missing.length : 0 }));
  } finally {
    await client.close();
  }
}

if (require.main === module) main().catch((error) => {
  console.error(`Seed failed: ${error.message}`);
  process.exitCode = 1;
});

module.exports = { events };
