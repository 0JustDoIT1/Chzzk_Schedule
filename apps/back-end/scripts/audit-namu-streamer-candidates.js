// Audit wiki titles against verified channel links in the local development catalog.
const { MongoClient } = require('mongodb');
const { candidates } = require('./import-namu-streamer-candidates');
const verified = require('../data/verified-chzzk-channels.json');
const aliases = require('../data/verified-namu-title-aliases.json');

const removableSuffixes = ['(인터넷 방송인)', '(프로게이머)', '(게임 해설가)', '(가수)'];

function matchingCandidates() {
  const channels = new Map(verified.channels.map((row) => [row.name, row]));
  const rows = candidates();
  for (const [title, name] of Object.entries(aliases.aliases)) {
    if (!rows.some((row) => row.title === title)) throw new Error(`Alias title missing: ${title}`);
    if (!channels.has(name)) throw new Error(`Alias channel missing: ${title} -> ${name}`);
  }
  const matches = [];
  const unresolved = [];
  for (const row of rows) {
    let name = row.title;
    let matchType = 'exact';
    if (!channels.has(name)) {
      const suffix = removableSuffixes.find((value) => name.endsWith(value));
      if (suffix) {
        name = name.slice(0, -suffix.length);
        matchType = 'document-suffix';
      }
    }
    if (!channels.has(name)) {
      name = aliases.aliases[row.title];
      matchType = 'reviewed-alias';
    }
    const channel = channels.get(name);
    if (channel) matches.push({ ...row, channel, matchType });
    else unresolved.push(row);
  }
  return { matches, unresolved };
}

async function main() {
  const { matches, unresolved } = matchingCandidates();
  const counts = matches.reduce((out, row) => {
    out[row.matchType] = (out[row.matchType] ?? 0) + 1;
    return out;
  }, {});
  const partnerUnresolved = unresolved.filter((row) => row.categories.includes('치지직 파트너 스트리머'));
  if (process.argv.includes('--apply')) {
    if (!['mongodb://127.0.0.1:27017', 'mongodb://localhost:27017'].includes(process.env.DB_URI) ||
        process.env.DB_Name !== 'Chzzk') {
      throw new Error('This audit is limited to the local Chzzk development database');
    }
    const client = new MongoClient(process.env.DB_URI, { serverSelectionTimeoutMS: 10000 });
    try {
      await client.connect();
      await client.db('Chzzk').collection('streamer_candidate').bulkWrite(matches.map(({ title, channel, matchType }) => ({
        updateOne: {
          filter: { title },
          update: { $set: { status: 'channel-verified', channelId: channel.channelId,
            verifiedSource: channel.source ?? verified.source, verifiedAt: verified.retrievedAt,
            channelMatchType: matchType } },
        },
      })));
    } finally {
      await client.close();
    }
  }
  console.log(JSON.stringify({ candidates: matches.length + unresolved.length, matched: matches.length,
    counts, unresolved: unresolved.length, partnerUnresolved: partnerUnresolved.map((row) => row.title),
    applied: process.argv.includes('--apply') }, null, 2));
}

if (require.main === module) main().catch((error) => {
  console.error(`Audit failed: ${error.message}`);
  process.exitCode = 1;
});

module.exports = { matchingCandidates };
