import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import request from 'supertest';
import { StreamerModule } from '../src/streamer/streamer.module';
import { ScheduleModule } from '../src/schedule/schedule.module';
import { SubmissionModule } from '../src/submission/submission.module';

const run = process.env.RUN_DB_INTEGRATION === '1' ? describe : describe.skip;

run('Submission with isolated Mongo database', () => {
  let app: INestApplication;
  let connection: Connection;
  const dbName = `chzzk_schedule_integration_${randomBytes(8).toString('hex')}`;
  const originalToken = process.env.ADMIN_WRITE_TOKEN;
  const token = randomBytes(32).toString('hex');

  beforeAll(async () => {
    const line = readFileSync('.env', 'utf8').split(/\r?\n/).find((item) => item.startsWith('DB_URI='));
    const uri = process.env.DB_URI ?? line?.slice('DB_URI='.length);
    if (!uri) throw new Error('DB_URI is required for isolated DB integration test');
    process.env.ADMIN_WRITE_TOKEN = token;
    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri, { dbName, serverSelectionTimeoutMS: 10000, retryAttempts: 0 }),
        StreamerModule,
        ScheduleModule,
        SubmissionModule,
      ],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    connection = app.get<Connection>(getConnectionToken());
  }, 30000);

  afterAll(async () => {
    if (connection && connection.name === dbName && dbName.startsWith('chzzk_schedule_integration_')) {
      await connection.dropDatabase();
    }
    if (app) await app.close();
    if (originalToken === undefined) delete process.env.ADMIN_WRITE_TOKEN;
    else process.env.ADMIN_WRITE_TOKEN = originalToken;
  }, 30000);

  it('keeps reports private until approval, then publishes a streamer', async () => {
    const name = `integration-${randomBytes(4).toString('hex')}`;
    const report = await request(app.getHttpServer()).post('/v1/submissions/streamer').send({
      streamer: { name, chzzkLink: `https://chzzk.naver.com/${name}`, isOfficial: false },
      sourceUrl: `https://chzzk.naver.com/${name}`,
    }).expect(201);
    expect(report.body.status).toBe('pending');
    expect(report.body.id).toMatch(/^[0-9a-f]{48}$/);

    await request(app.getHttpServer()).get(`/v1/streamer/name/${name}`).expect(404);
    const pending = await request(app.getHttpServer()).get('/v1/submissions/pending')
      .set('Authorization', `Bearer ${token}`).expect(200);
    const id = pending.body[0]._id as string;
    await request(app.getHttpServer()).patch(`/v1/submissions/${id}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .send({ payload: pending.body[0].payload, sourceUrl: pending.body[0].sourceUrl, officialConfirmed: false })
      .expect(200);
    await request(app.getHttpServer()).get(`/v1/streamer/name/${name}`).expect(200);
    await request(app.getHttpServer()).get(`/v1/submissions/${report.body.id}/status`)
      .expect(200, { id: report.body.id, status: 'approved' });

    const memberName = `member-${randomBytes(4).toString('hex')}`;
    await request(app.getHttpServer()).post('/v1/streamer/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: memberName, chzzkLink: `https://chzzk.naver.com/${memberName}`, isOfficial: false })
      .expect(201);

    const title = `integration-schedule-${randomBytes(4).toString('hex')}`;
    const scheduleReport = await request(app.getHttpServer()).post('/v1/submissions/schedule').send({
      schedule: {
        isOfficial: false,
        streamerName: name,
        category: 'together',
        title,
        member: [memberName],
        fullDay: false,
        startAt: '2026-11-13T12:00:00+09:00',
        endAt: '2026-11-13T13:00:00+09:00',
      },
      sourceUrl: `https://chzzk.naver.com/${name}`,
    }).expect(201);
    const before = await request(app.getHttpServer()).get('/v1/schedule/month/2026-11-13').expect(200);
    expect(JSON.stringify(before.body)).not.toContain(title);

    const pendingSchedule = await request(app.getHttpServer()).get('/v1/submissions/pending')
      .set('Authorization', `Bearer ${token}`).expect(200);
    const scheduleSubmission = pendingSchedule.body.find((item: { kind: string }) => item.kind === 'schedule');
    const scheduleId = scheduleSubmission._id as string;
    await request(app.getHttpServer()).patch(`/v1/submissions/${scheduleId}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .send({ payload: scheduleSubmission.payload, sourceUrl: scheduleSubmission.sourceUrl, officialConfirmed: false })
      .expect(200);
    const after = await request(app.getHttpServer()).get('/v1/schedule/month/2026-11-13').expect(200);
    expect(JSON.stringify(after.body)).toContain(title);
    const published = Object.values(after.body).flatMap((day: any) => day.list as { _id: string; title: string }[]).filter((item) => item.title === title);
    expect(published).toHaveLength(1);
    const firstRevision = await request(app.getHttpServer()).get(`/v1/schedule/id/${published[0]._id}`).expect(200);
    expect(firstRevision.body.sourceUrl).toBe(scheduleSubmission.sourceUrl);
    expect(firstRevision.body.revisionHistory).toHaveLength(1);
    expect(firstRevision.body.revisionHistory[0].version).toBe(1);
    const memberCalendar = await request(app.getHttpServer()).get(`/v1/schedule/month/2026-11-13/name/${memberName}`).expect(200);
    expect(JSON.stringify(memberCalendar.body)).toContain(published[0]._id);
    await request(app.getHttpServer()).get(`/v1/submissions/${scheduleReport.body.id}/status`)
      .expect(200, { id: scheduleReport.body.id, status: 'approved' });

    const editedTitle = `${title}-edited`;
    await request(app.getHttpServer()).post('/v1/submissions/schedule').send({
      schedule: {
        isOfficial: false, streamerName: name, category: 'together', title: editedTitle,
        member: [memberName], fullDay: false,
        startAt: '2026-11-13T12:00:00+09:00', endAt: '2026-11-13T13:00:00+09:00',
      },
      sourceUrl: `https://chzzk.naver.com/${name}`,
      targetScheduleId: published[0]._id,
    }).expect(201);
    const pendingEdit = await request(app.getHttpServer()).get('/v1/submissions/pending')
      .set('Authorization', `Bearer ${token}`).expect(200);
    const editSubmission = pendingEdit.body.find((item: { kind: string }) => item.kind === 'schedule-edit');
    const editId = editSubmission._id as string;
    await request(app.getHttpServer()).patch(`/v1/submissions/${editId}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .send({ payload: editSubmission.payload, sourceUrl: editSubmission.sourceUrl, officialConfirmed: false, changeNote: '제목 수정' })
      .expect(200);
    const secondRevision = await request(app.getHttpServer()).get(`/v1/schedule/id/${published[0]._id}`).expect(200);
    expect(secondRevision.body.revisionHistory).toHaveLength(2);
    expect(secondRevision.body.revisionHistory[1].note).toBe('제목 수정');
    expect(secondRevision.body.revisionHistory[1].changedFields).toContain('title');
    const memberAfterEdit = await request(app.getHttpServer()).get(`/v1/schedule/month/2026-11-13/name/${memberName}`).expect(200);
    expect(JSON.stringify(memberAfterEdit.body)).toContain(editedTitle);
    expect(JSON.stringify(memberAfterEdit.body)).toContain(published[0]._id);

    await request(app.getHttpServer()).post('/v1/submissions/schedule').send({
      schedule: {
        isOfficial: false, streamerName: name, category: 'together', title: editedTitle,
        member: [memberName], fullDay: false, status: 'cancelled',
        startAt: '2026-11-13T12:00:00+09:00', endAt: '2026-11-13T13:00:00+09:00',
      },
      sourceUrl: `https://chzzk.naver.com/${name}`,
      targetScheduleId: published[0]._id,
    }).expect(201);
    const pendingCancellation = await request(app.getHttpServer()).get('/v1/submissions/pending')
      .set('Authorization', `Bearer ${token}`).expect(200);
    const cancellation = pendingCancellation.body.find((item: { kind: string; payload: { status?: string } }) => item.kind === 'schedule-edit' && item.payload.status === 'cancelled');
    await request(app.getHttpServer()).patch(`/v1/submissions/${cancellation._id}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .send({ payload: cancellation.payload, sourceUrl: cancellation.sourceUrl, officialConfirmed: false, changeNote: '방송 취소 공지' })
      .expect(200);
    const cancelled = await request(app.getHttpServer()).get(`/v1/schedule/id/${published[0]._id}`).expect(200);
    expect(cancelled.body.status).toBe('cancelled');
    expect(cancelled.body.revisionHistory[2].changedFields).toContain('status');
    const cancelledMonth = await request(app.getHttpServer()).get('/v1/schedule/month/2026-11-13').expect(200);
    expect(JSON.stringify(cancelledMonth.body)).toContain('cancelled');

    const unknownTitle = `${title}-unknown`;
    await request(app.getHttpServer()).post('/v1/submissions/schedule').send({
      schedule: {
        isOfficial: false, streamerName: name, category: 'personal', title: unknownTitle,
        fullDay: false, startTimeKnown: false, endTimeKnown: false,
        startAt: '2026-11-15T00:00:00+09:00', endAt: '2026-11-15T00:00:00+09:00',
      },
      sourceUrl: `https://chzzk.naver.com/${name}`,
    }).expect(201);
    const pendingUnknown = await request(app.getHttpServer()).get('/v1/submissions/pending')
      .set('Authorization', `Bearer ${token}`).expect(200);
    const unknown = pendingUnknown.body.find((item: { payload: { title?: string } }) => item.payload.title === unknownTitle);
    await request(app.getHttpServer()).patch(`/v1/submissions/${unknown._id}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .send({ payload: unknown.payload, sourceUrl: unknown.sourceUrl, officialConfirmed: false })
      .expect(200);
    const unknownDay = await request(app.getHttpServer()).get('/v1/schedule/date/2026-11-15').expect(200);
    expect(JSON.stringify(unknownDay.body)).toContain(unknownTitle);
    expect(JSON.stringify(unknownDay.body)).toContain('startTimeKnown');

    await request(app.getHttpServer()).post('/v1/submissions/schedule').send({
      schedule: { isOfficial: true, streamerName: name, category: 'official', title: 'forged', fullDay: false,
        startAt: '2026-11-14T12:00:00+09:00', endAt: '2026-11-14T13:00:00+09:00' },
      sourceUrl: `https://chzzk.naver.com/${name}`,
    }).expect(400);

    await request(app.getHttpServer()).post('/v1/streamer/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '치지직 공식', chzzkLink: 'https://chzzk.naver.com/official', isOfficial: true })
      .expect(201);
    const officialTitle = `official-${randomBytes(4).toString('hex')}`;
    await request(app.getHttpServer()).post('/v1/submissions/schedule').send({
      schedule: { isOfficial: false, streamerName: '치지직 공식', category: 'content', title: officialTitle, fullDay: false,
        startAt: '2026-11-14T12:00:00+09:00', endAt: '2026-11-14T13:00:00+09:00' },
      sourceUrl: 'https://chzzk.naver.com/official',
    }).expect(201);
    const officialPending = await request(app.getHttpServer()).get('/v1/submissions/pending')
      .set('Authorization', `Bearer ${token}`).expect(200);
    const officialSubmission = officialPending.body.find((item: { payload: { title?: string } }) => item.payload.title === officialTitle);
    const officialPayload = { ...officialSubmission.payload, category: 'official', isOfficial: true };
    await request(app.getHttpServer()).patch(`/v1/submissions/${officialSubmission._id}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .send({ payload: officialPayload, sourceUrl: officialSubmission.sourceUrl, officialConfirmed: false })
      .expect(400);
    await request(app.getHttpServer()).patch(`/v1/submissions/${officialSubmission._id}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .send({ payload: officialPayload, sourceUrl: officialSubmission.sourceUrl, officialConfirmed: true })
      .expect(200);
    const officialCalendar = await request(app.getHttpServer()).get('/v1/schedule/official/month/2026-11-14').expect(200);
    expect(JSON.stringify(officialCalendar.body)).toContain(officialTitle);

    await request(app.getHttpServer()).post('/v1/streamer/add').send({
      name: 'unauthorized', chzzkLink: 'https://chzzk.naver.com/unauthorized', isOfficial: false,
    }).expect(401);

    const rejected = await request(app.getHttpServer()).post('/v1/submissions/streamer').send({
      streamer: { name: 'rejected', chzzkLink: 'https://chzzk.naver.com/rejected', isOfficial: false },
      sourceUrl: 'https://chzzk.naver.com/rejected',
    }).expect(201);
    const pendingRejection = await request(app.getHttpServer()).get('/v1/submissions/pending')
      .set('Authorization', `Bearer ${token}`).expect(200);
    const rejectedId = pendingRejection.body.find((item: { kind: string; payload: { name?: string } }) => item.payload.name === 'rejected')._id as string;
    await request(app.getHttpServer()).patch(`/v1/submissions/${rejectedId}/reject`)
      .set('Authorization', `Bearer ${token}`).send({ reason: 'Test rejection' }).expect(200);
    await request(app.getHttpServer()).get(`/v1/submissions/${rejected.body.id}/status`)
      .expect(200, { id: rejected.body.id, status: 'rejected' });
    await request(app.getHttpServer()).get('/v1/streamer/name/rejected').expect(404);
  });
});
