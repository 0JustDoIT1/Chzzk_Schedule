import { BadRequestException } from '@nestjs/common';
import { plainScheduleContents, ScheduleService } from './schedule.service';

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

  it('rejects invalid month and id inputs before querying', async () => {
    model.find.mockClear();
    await expect(service.getScheduleListByMonth('2026-99-01')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.getScheduleListByMonth('not-a-month')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.getScheduleListByMonthWithId('2026-11-01', 'not-an-id')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.getScheduleById('not-an-id')).rejects.toBeInstanceOf(BadRequestException);
    expect(model.find).not.toHaveBeenCalled();
  });

  it('converts rich text to plain text before storage', () => {
    expect(plainScheduleContents('<p>안녕 &amp; 반가워</p><p><img src=x onerror=alert(1)>다음</p>'))
      .toBe('안녕 & 반가워\n다음');
    expect(plainScheduleContents('줄 1<br>줄 2')).toBe('줄 1\n줄 2');
  });

  it('places exact midnight ends only on the preceding calendar day', () => {
    const monthEntries = [
      { _id: 'overnight', startAt: new Date('2026-11-12T14:00:00Z'), endAt: new Date('2026-11-12T15:00:00Z') },
      { _id: 'unknown-end', startAt: new Date('2026-11-12T15:00:00Z'), endAt: new Date('2026-11-12T15:00:00Z') },
      { _id: 'month-end', startAt: new Date('2026-11-30T14:00:00Z'), endAt: new Date('2026-11-30T15:00:00Z') },
    ];
    const result = service.editScheduleListByMonth(
      monthEntries as never,
      new Date('2026-10-31T15:00:00Z'),
      new Date('2026-11-30T15:00:00Z'),
    );
    expect(result['2026-11-12'].list.map((entry) => entry._id)).toEqual(['overnight']);
    expect(result['2026-11-13'].list.map((entry) => entry._id)).toEqual(['unknown-end']);
    expect(result['2026-11-30'].list.map((entry) => entry._id)).toEqual(['month-end']);
    expect(result['2026-12-01']).toBeUndefined();
  });
});
