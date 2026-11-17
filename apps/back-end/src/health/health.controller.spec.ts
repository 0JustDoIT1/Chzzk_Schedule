import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('reports liveness without requiring a database', () => {
    const controller = new HealthController({ readyState: 0 } as any);
    expect(controller.live()).toEqual({ status: 'ok' });
  });

  it('reports readiness only after a database ping', async () => {
    const ping = jest.fn().mockResolvedValue({ ok: 1 });
    const controller = new HealthController({ readyState: 1, db: { admin: () => ({ ping }) } } as any);
    await expect(controller.ready()).resolves.toEqual({ status: 'ready' });
    expect(ping).toHaveBeenCalledTimes(1);
  });

  it('fails readiness when the database is unavailable', async () => {
    const controller = new HealthController({ readyState: 0 } as any);
    await expect(controller.ready()).rejects.toThrow('Database unavailable');
  });
});
