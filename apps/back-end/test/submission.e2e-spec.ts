jest.mock('../src/submission/submission.service', () => ({ SubmissionService: class {} }));
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { SubmissionController } from '../src/submission/submission.controller';
import { SubmissionService } from '../src/submission/submission.service';

describe('Submission HTTP flow', () => {
  let app: INestApplication;
  const originalToken = process.env.ADMIN_WRITE_TOKEN;
  const service = {
    submitStreamer: jest.fn().mockResolvedValue({ id: 'a'.repeat(48), status: 'pending' }),
    submitSchedule: jest.fn(),
    getStatus: jest.fn().mockResolvedValue({ id: 'a'.repeat(48), status: 'pending' }),
    listPending: jest.fn().mockResolvedValue([]),
    approve: jest.fn().mockResolvedValue({ status: 'approved' }),
    reject: jest.fn(),
  };

  beforeAll(async () => {
    process.env.ADMIN_WRITE_TOKEN = 'a'.repeat(32);
    const module = await Test.createTestingModule({
      controllers: [SubmissionController],
      providers: [{ provide: SubmissionService, useValue: service }],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    if (originalToken === undefined) delete process.env.ADMIN_WRITE_TOKEN;
    else process.env.ADMIN_WRITE_TOKEN = originalToken;
  });

  it('accepts a public report and exposes only its status', async () => {
    await request(app.getHttpServer()).post('/v1/submissions/streamer').send({
      streamer: { name: 'test', chzzkLink: 'https://chzzk.naver.com/test', isOfficial: false },
      sourceUrl: 'https://chzzk.naver.com/test',
    }).expect(201, { id: 'a'.repeat(48), status: 'pending' });
    await request(app.getHttpServer()).get(`/v1/submissions/${'a'.repeat(48)}/status`)
      .expect(200, { id: 'a'.repeat(48), status: 'pending' });
  });

  it('rejects anonymous review requests', async () => {
    await request(app.getHttpServer()).get('/v1/submissions/pending').expect(401);
    await request(app.getHttpServer()).patch('/v1/submissions/507f1f77bcf86cd799439011/approve').expect(401);
  });

  it('allows the configured admin to review', async () => {
    await request(app.getHttpServer()).get('/v1/submissions/pending')
      .set('Authorization', `Bearer ${'a'.repeat(32)}`).expect(200, []);
    await request(app.getHttpServer()).patch('/v1/submissions/507f1f77bcf86cd799439011/approve')
      .set('Authorization', `Bearer ${'a'.repeat(32)}`)
      .send({ payload: { name: 'test', chzzkLink: 'https://chzzk.naver.com/test', isOfficial: false }, sourceUrl: 'https://chzzk.naver.com/test', officialConfirmed: false })
      .expect(200, { status: 'approved' });
  });
});
