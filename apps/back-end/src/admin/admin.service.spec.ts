import { AdminService } from './admin.service';
import { verifyAdminSession } from './admin-session';

describe('Single administrator login', () => {
  const limits = { findOne: jest.fn(), findOneAndUpdate: jest.fn() };
  const service = new AdminService(limits as any);
  const previous = {
    username: process.env.ADMIN_REVIEW_USERNAME,
    password: process.env.ADMIN_REVIEW_PASSWORD,
    token: process.env.ADMIN_WRITE_TOKEN,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ADMIN_REVIEW_USERNAME = 'reviewer';
    process.env.ADMIN_REVIEW_PASSWORD = 'p'.repeat(32);
    process.env.ADMIN_WRITE_TOKEN = 't'.repeat(32);
    limits.findOne.mockReturnValue({ lean: () => ({ exec: async () => null }) });
    limits.findOneAndUpdate.mockReturnValue({ exec: async () => ({ count: 1 }) });
  });

  afterAll(() => {
    for (const [name, value] of Object.entries({
      ADMIN_REVIEW_USERNAME: previous.username,
      ADMIN_REVIEW_PASSWORD: previous.password,
      ADMIN_WRITE_TOKEN: previous.token,
    })) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });

  it('issues a signed session only for the configured account', async () => {
    const result = await service.login('reviewer', 'p'.repeat(32), '127.0.0.1');
    expect(verifyAdminSession(result.token, 'reviewer', 't'.repeat(32))).toBe(true);
    expect(verifyAdminSession(result.token, 'other', 't'.repeat(32))).toBe(false);
  });

  it('counts failed attempts in the shared database', async () => {
    await expect(service.login('reviewer', 'wrong', '127.0.0.1')).rejects.toThrow('로그인 정보를');
    expect(limits.findOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ count: { $lt: 5 } }),
      expect.objectContaining({ $inc: { count: 1 } }),
      expect.objectContaining({ upsert: true }),
    );
  });

  it('blocks attempts after five failures', async () => {
    limits.findOne.mockReturnValue({ lean: () => ({ exec: async () => ({ count: 5 }) }) });
    await expect(service.login('reviewer', 'p'.repeat(32), '127.0.0.1')).rejects.toThrow('로그인 시도가');
  });
});
