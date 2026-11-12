import { BadRequestException } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

describe('ScheduleService KST date boundary', () => {
  const entries = [
    { _id: 'previous', title: '전날 종료', startAt: new Date('2026-11-12T14:59:00Z'), endAt: new Date('2026-11-12T15:00:00Z') },
    { _id: 'midnight', title: '자정 시작', startAt: new Date('2026-11-12T15:00:00Z'), endAt: new Date('2026-11-12T16:00:00Z') },
    { _id: 'legacy', title: '기존 일정', startAt: new Date('2026-11-12T16:00:00Z'), endAt: new Date('2026-11-12T17:00:00Z') },
    { _id: 'unknown', title: '시간 미정', startAt: new Date('2026-11-12T15:00:00Z'), endAt: new Date('2026-11-12T15:00:00Z'), startTimeKnown: false },
    { _id: 'next', title: '다음날 시작', startAt: new Date('2026-11-13T15:00:00Z'), endAt: new Date('2026-11-13T16:00:00Z') },
  ];

  const model = {
    find: jest.fn((query: { $or: Array<Record<string, { $gte?: Date; $lt?: Date; $gt?: Date }>> }) => ({
      exec: async () => entries.filter((entry) => {
        const [startsToday, overlaps] = query.$or;
        return (entry.startAt >= startsToday.startAt.$gte! && entry.startAt < startsToday.startAt.$lt!) ||
          (entry.startAt < overlaps.startAt.$lt! && entry.endAt > overlaps.endAt.$gt!);
      }),
    })),
  };
  const service = new ScheduleService(model as never, {} as never, {} as never);

  it('includes KST midnight, excludes exact end and next midnight, and treats legacy time as known', async () => {
    const result = await service.getScheduleListByDate('2026-11-13');
    expect(Object.values(result).flat().map((entry) => entry._id)).toEqual(['midnight', 'legacy', 'unknown']);
    expect(result['미정'].map((entry) => entry._id)).toEqual(['unknown']);
    expect(result['00'].map((entry) => entry._id)).toEqual(['midnight']);
    expect(result['01'].map((entry) => entry._id)).toEqual(['legacy']);
  });

  it('rejects an impossible calendar date', async () => {
    model.find.mockClear();
    await expect(service.getScheduleListByDate('2026-02-30')).rejects.toBeInstanceOf(BadRequestException);
    expect(model.find).not.toHaveBeenCalled();
  });
});
