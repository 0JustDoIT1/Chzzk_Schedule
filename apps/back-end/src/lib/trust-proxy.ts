import type { NestExpressApplication } from '@nestjs/platform-express';

export function configureTrustProxy(app: Pick<NestExpressApplication, 'set'>, raw = process.env.TRUST_PROXY_HOPS): number {
  if (raw === undefined || raw === '') return 0;
  if (!/^[1-5]$/.test(raw)) throw new Error('TRUST_PROXY_HOPS must be an integer from 1 to 5');
  const hops = Number(raw);
  app.set('trust proxy', hops);
  return hops;
}
