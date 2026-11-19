// Headless Chrome mobile viewport check. Start the production servers first.
const { spawn } = require('node:child_process');
const { mkdtempSync, readFileSync, existsSync, rmSync, writeFileSync, mkdirSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

const chromePath = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const site = process.env.SITE_BASE_URL ?? 'http://localhost:3000';
const width = Number(process.env.MOBILE_WIDTH ?? 390);
if (!Number.isInteger(width) || width < 320 || width > 767) throw new Error('MOBILE_WIDTH must be 320–767');
const profile = mkdtempSync(join(tmpdir(), 'chzzk-mobile-'));
const chrome = spawn(chromePath, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--remote-debugging-port=0',
  `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function main() {
  let port;
  for (let i = 0; i < 60; i++) {
    const file = join(profile, 'DevToolsActivePort');
    if (existsSync(file)) { port = readFileSync(file, 'utf8').split('\n')[0]; break; }
    if (chrome.exitCode !== null) throw new Error(`Chrome exited: ${chrome.exitCode}`);
    await sleep(100);
  }
  if (!port) throw new Error('Chrome debugging endpoint unavailable');
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const tab = tabs.find((item) => item.type === 'page');
  if (!tab) throw new Error('Chrome page unavailable');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) return;
    const promise = pending.get(message.id);
    if (!promise) return;
    pending.delete(message.id);
    message.error ? promise.reject(new Error(message.error.message)) : promise.resolve(message.result);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const key = ++id;
    pending.set(key, { resolve, reject });
    ws.send(JSON.stringify({ id: key, method, params }));
  });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  await send('Page.navigate', { url: `${site}/all/calendar?date=2026-11-20` });
  await sleep(1600);
  const evaluated = await send('Runtime.evaluate', { expression: `JSON.stringify({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, mobile: getComputedStyle(document.querySelector('[aria-label="월간 날짜 선택"]')).display, desktop: getComputedStyle(document.querySelector('[aria-label="월간 일정 달력"]')).display })`, returnByValue: true });
  const result = JSON.parse(evaluated.result.value);
  if (process.env.MOBILE_SCREENSHOT) {
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(process.env.MOBILE_SCREENSHOT, Buffer.from(shot.data, 'base64'));
  }
  if (result.width !== width || result.scrollWidth > width || result.mobile === 'none' || result.desktop !== 'none') {
    throw new Error(`Mobile layout failed: ${JSON.stringify(result)}`);
  }
  const next = await send('Runtime.evaluate', { expression: `document.querySelector('button[aria-label="다음 달"]').click(); true`, returnByValue: true });
  if (next.result.value !== true) throw new Error('Next month button unavailable');
  await sleep(200);
  const moved = await send('Runtime.evaluate', { expression: `document.body.innerText.includes('2026년 12월')`, returnByValue: true });
  if (moved.result.value !== true) throw new Error('Next month did not update');
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: width / 2, y: 700 }] });
  await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: width / 2, y: 400 }] });
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(300);
  const scroll = await send('Runtime.evaluate', { expression: 'window.scrollY', returnByValue: true });
  if (scroll.result.value <= 0) throw new Error('Touch scroll did not move the page');
  const routes = ['/today', '/all/timeline', '/schedule/add', '/streamer', '/admin'];
  for (const route of routes) {
    await send('Page.navigate', { url: `${site}${route}` });
    await sleep(750);
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
    const check = await send('Runtime.evaluate', { expression: 'JSON.stringify({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, text: document.body.innerText.slice(0, 100) })', returnByValue: true });
    const page = JSON.parse(check.result.value);
    if (page.width !== width || page.scrollWidth > width || !page.text) throw new Error(`${route}: mobile layout failed: ${JSON.stringify(page)}`);
    if (process.env.MOBILE_SCREENSHOT_DIR) {
      mkdirSync(process.env.MOBILE_SCREENSHOT_DIR, { recursive: true });
      const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      writeFileSync(join(process.env.MOBILE_SCREENSHOT_DIR, `${route.slice(1).replaceAll('/', '-')}.png`), Buffer.from(shot.data, 'base64'));
    }
  }
  ws.close();
  process.stdout.write(`Mobile viewport verified: ${JSON.stringify(result)}, touch scroll and ${routes.length} routes\n`);
}
main().catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; })
  .finally(async () => {
    chrome.kill();
    if (chrome.exitCode === null) await new Promise((resolve) => chrome.once('exit', resolve));
    for (let i = 0; i < 10; i++) {
      try { rmSync(profile, { recursive: true, force: true }); break; }
      catch (error) { if (i === 9) throw error; await sleep(100); }
    }
  });
