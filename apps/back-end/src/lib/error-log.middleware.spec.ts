import { EventEmitter } from 'node:events';
import { errorLogMiddleware } from './error-log.middleware';

describe('Server error log', () => {
  const logger = { error: jest.fn() };
  const middleware = errorLogMiddleware(logger);

  beforeEach(() => logger.error.mockClear());

  it('logs a 5xx route without a raw URL, token, or body', () => {
    const response = new EventEmitter() as any;
    response.statusCode = 500;
    const next = jest.fn();
    middleware({ method: 'GET', url: '/v1/submissions/private-token/status', route: { path: '/v1/submissions/:id/status' }, body: { password: 'private' } } as any, response, next);
    response.emit('finish');
    expect(next).toHaveBeenCalledTimes(1);
    const output = logger.error.mock.calls[0][0] as string;
    expect(output).toContain('http_server_error');
    expect(output).toContain('/v1/submissions/:id/status');
    expect(output).not.toContain('private-token');
    expect(output).not.toContain('private');
  });

  it('skips expected client errors', () => {
    const response = new EventEmitter() as any;
    response.statusCode = 404;
    middleware({ method: 'GET', route: { path: '/v1/example' } } as any, response, jest.fn());
    response.emit('finish');
    expect(logger.error).not.toHaveBeenCalled();
  });
});
