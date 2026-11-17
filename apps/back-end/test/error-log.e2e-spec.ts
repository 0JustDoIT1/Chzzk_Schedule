import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { errorLogMiddleware } from '../src/lib/error-log.middleware';

@Controller('log-probe')
class LogProbeController {
  @Post(':id')
  fail(@Param('id') _id: string, @Body() _body: unknown) {
    throw new HttpException('Test server failure', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @Get('client-error/:id')
  clientError() {
    throw new HttpException('Test client failure', HttpStatus.BAD_REQUEST);
  }
}

describe('Server error HTTP logging', () => {
  it('records a route pattern and status without the token, query, or request body', async () => {
    const logger = { error: jest.fn() };
    const module = await Test.createTestingModule({ controllers: [LogProbeController] }).compile();
    const app = module.createNestApplication();
    app.use(errorLogMiddleware(logger));
    app.setGlobalPrefix('v1');
    await app.init();
    try {
      await request(app.getHttpServer())
        .post('/v1/log-probe/private-receipt-token?secret=private-query')
        .send({ privateField: 'private-body' })
        .expect(500);
      expect(logger.error).toHaveBeenCalledTimes(1);
      const output = logger.error.mock.calls[0][0] as string;
      expect(JSON.parse(output)).toMatchObject({ event: 'http_server_error', method: 'POST', statusCode: 500, route: '/v1/log-probe/:id' });
      for (const secret of ['private-receipt-token', 'private-query', 'private-body']) {
        expect(output).not.toContain(secret);
      }

      await request(app.getHttpServer()).get('/v1/log-probe/client-error/private-receipt-token').expect(400);
      expect(logger.error).toHaveBeenCalledTimes(1);
    } finally {
      await app.close();
    }
  });
});
