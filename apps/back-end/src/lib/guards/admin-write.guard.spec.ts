import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AdminWriteGuard } from './admin-write.guard';

describe('AdminWriteGuard', () => {
  const originalToken = process.env.ADMIN_WRITE_TOKEN;
  const guard = new AdminWriteGuard();
  const context = (authorization?: string) =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ headers: { authorization } }) }),
    }) as ExecutionContext;

  afterEach(() => {
    if (originalToken === undefined) delete process.env.ADMIN_WRITE_TOKEN;
    else process.env.ADMIN_WRITE_TOKEN = originalToken;
  });

  it('fails closed when the admin token is not configured', () => {
    delete process.env.ADMIN_WRITE_TOKEN;
    expect(() => guard.canActivate(context())).toThrow(UnauthorizedException);
  });

  it('rejects missing and incorrect credentials', () => {
    process.env.ADMIN_WRITE_TOKEN = 'a'.repeat(32);
    expect(() => guard.canActivate(context())).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context('Bearer ' + 'b'.repeat(32)))).toThrow(
      UnauthorizedException,
    );
  });

  it('allows the configured admin credential', () => {
    process.env.ADMIN_WRITE_TOKEN = 'a'.repeat(32);
    expect(guard.canActivate(context('Bearer ' + 'a'.repeat(32)))).toBe(true);
  });
});
