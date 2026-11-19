// Read-only production HTTP smoke check. Start backend and frontend servers first.
const { randomBytes } = require('node:crypto');

const site = process.env.SITE_BASE_URL ?? 'http://localhost:3000';
const api = process.env.API_BASE_URL ?? 'http://localhost:3001';
const expectedMetadataBase = process.env.EXPECTED_METADATA_BASE;

async function check(path, expectedStatus, options = {}) {
  const response = await fetch(`${site}${path}`);
  const html = await response.text();
  if (response.status !== expectedStatus) throw new Error(`${path}: HTTP ${response.status}, expected ${expectedStatus}`);
  if (options.private) {
    if (response.headers.get('cache-control') !== 'private, no-store') throw new Error(`${path}: cache header missing`);
    if (response.headers.get('x-robots-tag') !== 'noindex, nofollow') throw new Error(`${path}: robots header missing`);
    if (response.headers.get('referrer-policy') !== 'no-referrer') throw new Error(`${path}: referrer header missing`);
  }
  if (options.rendered && html.includes('로딩 중')) throw new Error(`${path}: server returned a loading placeholder`);
}

async function main() {
  const ready = await fetch(`${api}/v1/health/ready`);
  if (!ready.ok) throw new Error(`Backend not ready: HTTP ${ready.status}`);

  const entry = await fetch(site, { redirect: 'manual' });
  if (entry.status !== 307 || new URL(entry.headers.get('location') ?? '/', site).pathname !== '/all/calendar') {
    throw new Error(`/: expected redirect to /all/calendar, got HTTP ${entry.status} ${entry.headers.get('location')}`);
  }
  await check('/today', 200, { rendered: true });
  if (expectedMetadataBase) {
    const html = await (await fetch(`${site}/today`)).text();
    const image = html.match(/<meta property="og:image" content="([^"]+)"\s*\/>/)?.[1];
    if (!image || new URL(image).origin !== new URL(expectedMetadataBase).origin) {
      throw new Error(`/today: Open Graph image origin does not match EXPECTED_METADATA_BASE`);
    }
  }
  await check('/admin', 200, { private: true });
  await check(`/submissions/${randomBytes(24).toString('hex')}`, 404, { private: true });
  await check('/submissions/invalid', 404, { private: true });

  const monthly = ['/all/calendar', '/all/timeline', '/chzzk/calendar', '/chzzk/timeline'];
  const streamerResponse = await fetch(`${api}/v1/streamer/all`);
  if (!streamerResponse.ok) throw new Error(`Streamer API: HTTP ${streamerResponse.status}`);
  const streamers = await streamerResponse.json();
  if (streamers[0]?.name) {
    const name = encodeURIComponent(streamers[0].name);
    monthly.push(`/streamer/${name}/calendar`, `/streamer/${name}/timeline`);
  }
  for (const path of monthly) await check(`${path}?date=2026-11-20`, 200, { rendered: true });
  process.stdout.write(`HTTP rendering verified: receipt 404, today, and ${monthly.length} monthly views.\n`);
}

main().catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
