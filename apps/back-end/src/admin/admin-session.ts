import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_MS = 8 * 60 * 60 * 1000;

export function issueAdminSession(username: string, secret: string): string {
  const account = Buffer.from(username).toString('base64url');
  const expires = String(Date.now() + SESSION_MS);
  const signature = createHmac('sha256', secret).update(`admin-session-v1:${account}:${expires}`).digest('hex');
  return `${account}.${expires}.${signature}`;
}

export function verifyAdminSession(token: string, username: string, secret: string): boolean {
  const [account, expires, signature, extra] = token.split('.');
  if (extra || !account || !expires || !signature || !/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;
  if (account !== Buffer.from(username).toString('base64url')) return false;
  const expected = Buffer.from(createHmac('sha256', secret).update(`admin-session-v1:${account}:${expires}`).digest('hex'));
  const actual = Buffer.from(signature);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
