jest.mock('../src/submission/submission.service', () => ({ SubmissionService: class {} }));
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { SubmissionController } from '../src/submission/submission.controller';
import { SubmissionService } from '../src/submission/submission.service';
import { configureTrustProxy } from '../src/lib/trust-proxy';

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
      streamer: { name: 'test', chzzkLink: 'https://chzzk.naver.com/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', isOfficial: false },
      sourceUrl: 'https://chzzk.naver.com/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    }).expect(201, { id: 'a'.repeat(48), status: 'pending' });
    await request(app.getHttpServer()).get(`/v1/submissions/${'a'.repeat(48)}/status`)
      .expect(200, { id: 'a'.repeat(48), status: 'pending' });
  });

  it('rejects non-channel streamer links before accepting a report', async () => {
    await request(app.getHttpServer()).post('/v1/submissions/streamer').send({
      streamer: { name: 'test', chzzkLink: 'https://example.com/video/123', isOfficial: false },
      sourceUrl: 'https://example.com/video/123',
    }).expect(400);
    await request(app.getHttpServer()).post('/v1/submissions/streamer').send({
      streamer: { name: 'test', chzzkLink: 'https://chzzk.naver.com/video', isOfficial: false },
      sourceUrl: 'https://chzzk.naver.com/video',
    }).expect(400);
  });

  it('ignores forwarded IP headers until a proxy hop is explicitly trusted', async () => {
    expect(() => configureTrustProxy(app.getHttpAdapter().getInstance(), '6')).toThrow('TRUST_PROXY_HOPS');
    service.submitStreamer.mockClear();
    const report = {
      streamer: { name: 'test', chzzkLink: 'https://chzzk.naver.com/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', isOfficial: false },
      sourceUrl: 'https://chzzk.naver.com/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    };
    await request(app.getHttpServer()).post('/v1/submissions/streamer')
      .set('X-Forwarded-For', '198.51.100.42, 203.0.113.9').send(report).expect(201);
    expect(service.submitStreamer.mock.calls[0][1]).toMatch(/^(::ffff:)?127\.0\.0\.1$/);

    configureTrustProxy(app.getHttpAdapter().getInstance(), '1');
    await request(app.getHttpServer()).post('/v1/submissions/streamer')
      .set('X-Forwarded-For', '198.51.100.42, 203.0.113.9').send(report).expect(201);
    expect(service.submitStreamer.mock.calls[1][1]).toBe('203.0.113.9');

    configureTrustProxy(app.getHttpAdapter().getInstance(), '2');
    await request(app.getHttpServer()).post('/v1/submissions/streamer')
      .set('X-Forwarded-For', '198.51.100.42, 203.0.113.9').send(report).expect(201);
    expect(service.submitStreamer.mock.calls[2][1]).toBe('198.51.100.42');
    app.getHttpAdapter().getInstance().set('trust proxy', false);
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
      .send({ payload: { name: 'test', chzzkLink: 'https://chzzk.naver.com/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', isOfficial: false }, sourceUrl: 'https://chzzk.naver.com/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', officialConfirmed: false })
      .expect(200, { status: 'approved' });
  });
});

