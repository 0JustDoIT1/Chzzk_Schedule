export interface ISchedule {
  isOfficial: boolean;
  streamer?: string;
  category: string;
  title: string;
  member?: string[];
  startAt: Date;
  endAt: Date;
  contents?: string;
}

export interface IScheduleInput {
  isOfficial: boolean;
  streamer?: string;
  category: string;
  title: string;
  member?: string[];
  fullDay: boolean;
  startAtDate: string;
  startAtTime: string;
  endAtDate: string;
  endAtTime: string;
  contents?: string;
}
