jest.mock('../streamer/streamer.service', () => ({ StreamerService: class {} }));
jest.mock('../schedule/schedule.service', () => ({ ScheduleService: class {} }));
import { SubmissionService } from './submission.service';

describe('SubmissionService', () => {
  const submissions = {
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
  };
  const streamers = { create: jest.fn() };
  const schedules = { create: jest.fn(), updateSchedule: jest.fn(), getScheduleById: jest.fn() };
  const service = new SubmissionService(submissions as any, streamers as any, schedules as any);

  beforeEach(() => jest.clearAllMocks());

  it('stores a streamer report without publishing it', async () => {
    submissions.create.mockResolvedValue({ receiptToken: 'receipt-token', status: 'pending' });
    const result = await service.submitStreamer({
      streamer: { name: 'test', chzzkLink: 'https://chzzk.naver.com/test', isOfficial: false, tag: [] },
      sourceUrl: 'https://chzzk.naver.com/test',
    });
    expect(result).toEqual({ id: 'receipt-token', status: 'pending' });
    expect(submissions.create).toHaveBeenCalledWith(expect.objectContaining({ kind: 'streamer', status: 'pending' }));
    expect(streamers.create).not.toHaveBeenCalled();
  });

  it('publishes only after approval', async () => {
    const report = { id: 'report-id', kind: 'streamer', payload: { name: 'test', chzzkLink: 'https://chzzk.naver.com/test', isOfficial: false }, status: 'processing', sourceUrl: 'https://chzzk.naver.com/test', save: jest.fn() };
    submissions.findOneAndUpdate.mockReturnValue({ exec: async () => report });
    await service.approve('507f1f77bcf86cd799439011', { payload: report.payload, sourceUrl: report.sourceUrl, officialConfirmed: false });
    expect(streamers.create).toHaveBeenCalledWith(report.payload);
    expect(report.status).toBe('approved');
    expect(report.save).toHaveBeenCalled();
  });

  it('rejects public official classification', () => {
    expect(() => service.submitStreamer({
      streamer: { name: 'test', chzzkLink: 'https://chzzk.naver.com/test', isOfficial: true, tag: [] },
      sourceUrl: 'https://chzzk.naver.com/test',
    })).toThrow();
  });

  it('requires explicit official-source confirmation on approval', async () => {
    const payload = { isOfficial: true, streamerName: 'some channel', category: 'official', title: 'event', fullDay: false, startAt: '2026-11-13T00:00:00+09:00', endAt: '2026-11-13T01:00:00+09:00' };
    const report = { id: 'report-id', kind: 'schedule', payload, status: 'processing', sourceUrl: 'https://chzzk.naver.com/test', save: jest.fn() };
    submissions.findOneAndUpdate.mockReturnValue({ exec: async () => report });
    await expect(service.approve('507f1f77bcf86cd799439011', { payload, sourceUrl: report.sourceUrl, officialConfirmed: false })).rejects.toThrow('공식 출처 확인');
    expect(schedules.create).not.toHaveBeenCalled();
    await service.approve('507f1f77bcf86cd799439011', { payload, sourceUrl: report.sourceUrl, officialConfirmed: true });
    expect(schedules.create).toHaveBeenCalledWith(expect.objectContaining({ streamerName: '치지직 공식', isOfficial: true }));
  });

  it('returns only status for a private receipt token', async () => {
    submissions.findOne.mockReturnValue({ select: () => ({ lean: () => ({ exec: async () => ({ status: 'rejected', payload: { name: 'private' } }) }) }) });
    const id = 'a'.repeat(48);
    expect(await service.getStatus(id)).toEqual({ id, status: 'rejected' });
    expect(submissions.findOne).toHaveBeenCalledWith({ receiptToken: id });
  });
});
