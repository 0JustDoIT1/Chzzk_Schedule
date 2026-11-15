import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { MongoClient } from 'mongodb';
import request from 'supertest';
import { ScheduleModule } from '../src/schedule/schedule.module';
import { StreamerModule } from '../src/streamer/streamer.module';

const run = process.env.RUN_DB_INTEGRATION === '1' ? describe : describe.skip;

run('Monthly calendar boundaries with isolated Mongo database', () => {
  let app: INestApplication;
  let connection: Connection;
  let uri: string;
  const dbName = `chzzk_schedule_integration_${randomBytes(8).toString('hex')}`;
  const hostId = new Types.ObjectId();
  const memberId = new Types.ObjectId();

  beforeAll(async () => {
    const line = readFileSync('.env', 'utf8').split(/\r?\n/).find((item) => item.startsWith('DB_URI='));
    uri = process.env.DB_URI ?? line?.slice('DB_URI='.length) ?? '';
    if (!uri) throw new Error('DB_URI is required for isolated DB integration test');
    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri, { dbName, serverSelectionTimeoutMS: 10000, retryAttempts: 0 }),
        StreamerModule,
        ScheduleModule,
      ],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('v1');
    await app.init();
    connection = app.get<Connection>(getConnectionToken());
    await connection.collection('schedule').insertMany([
      { title: 'ends-at-month-start', startAt: new Date('2026-10-31T14:00:00Z'), endAt: new Date('2026-10-31T15:00:00Z') },
      { title: 'ends-at-midnight', startAt: new Date('2026-11-29T14:00:00Z'), endAt: new Date('2026-11-29T15:00:00Z') },
      { title: 'ends-at-next-month', startAt: new Date('2026-11-30T14:00:00Z'), endAt: new Date('2026-11-30T15:00:00Z') },
      { title: 'unknown-end', startAt: new Date('2026-11-29T15:00:00Z'), endAt: new Date('2026-11-29T15:00:00Z'), endTimeKnown: false },
    ].map((entry) => ({
      ...entry, isOfficial: true, streamerName: '치지직 공식', streamerId: hostId,
      member: ['참여자'], memberIds: [memberId], chzzkLink: 'https://chzzk.naver.com/test',
      category: 'official', fullDay: false,
    })));
  }, 30000);

  afterAll(async () => {
    if (app) await app.close();
    if (connection && dbName.startsWith('chzzk_schedule_integration_')) {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        await client.db(dbName).dropDatabase();
      } finally {
        await client.close();
      }
    }
  }, 30000);

  it('keeps exact midnight ends on the preceding day in every monthly view', async () => {
    const paths = [
      '/v1/schedule/month/2026-11-15',
      `/v1/schedule/month/2026-11-15/id/${hostId}`,
      '/v1/schedule/month/2026-11-15/name/참여자',
      '/v1/schedule/official/month/2026-11-15',
    ];
    for (const path of paths) {
      const { body } = await request(app.getHttpServer()).get(path).expect(200);
      expect(JSON.stringify(body)).not.toContain('ends-at-month-start');
      expect(body['2026-11-29'].list.map((entry: { title: string }) => entry.title)).toContain('ends-at-midnight');
      expect(body['2026-11-30'].list.map((entry: { title: string }) => entry.title)).toEqual(
        expect.arrayContaining(['ends-at-next-month', 'unknown-end']),
      );
      expect(body['2026-12-01']).toBeUndefined();
    }
  });
});
