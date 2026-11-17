import { Logger } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

export function errorLogMiddleware(logger: Pick<Logger, 'error'>) {
  return (request: Request, response: Response, next: NextFunction) => {
    const startedAt = Date.now();
    response.on('finish', () => {
      if (response.statusCode < 500) return;
      logger.error(JSON.stringify({
        event: 'http_server_error',
        method: request.method,
        statusCode: response.statusCode,
        route: request.route?.path ?? '<unmatched>',
        durationMs: Date.now() - startedAt,
      }));
    });
    next();
  };
}
