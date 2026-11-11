import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AllCategory } from '@shared/constants';
import { HydratedDocument, Types } from 'mongoose';

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema({ _id: false })
export class ScheduleRevision {
  @Prop({ required: true, type: Number })
  version: number;

  @Prop({ required: true, type: String })
  sourceUrl: string;

  @Prop({ required: true, type: Date })
  reviewedAt: Date;

  @Prop({ required: true, type: String })
  note: string;

  @Prop({ type: [String], default: [] })
  changedFields: string[];
}

export const ScheduleRevisionSchema = SchemaFactory.createForClass(ScheduleRevision);

@Schema({ collection: 'schedule', timestamps: true })
export class Schedule {
  @Prop({ required: true, type: Boolean })
  isOfficial: boolean;

  @Prop({ required: true, type: String })
  streamerName: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Streamer' })
  streamerId: Types.ObjectId;

  @Prop({ required: true, type: String })
  chzzkLink: string;

  @Prop({ required: true, enum: AllCategory })
  category: AllCategory;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: false, type: () => [String] })
  member?: string[];

  @Prop({ required: false, type: [Types.ObjectId], ref: 'Streamer', default: [] })
  memberIds?: Types.ObjectId[];

  @Prop({ required: true, type: Boolean })
  fullDay: boolean;

  @Prop({ required: true, type: Date })
  startAt: Date;

  @Prop({ required: true, type: Date })
  endAt: Date;

  @Prop({ required: false, type: String })
  contents?: string;

  @Prop({ required: false, type: String })
  sourceUrl?: string;

  @Prop({ type: [ScheduleRevisionSchema], default: [] })
  revisionHistory?: ScheduleRevision[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
ScheduleSchema.index({ streamerId: 1, startAt: 1 });
ScheduleSchema.index({ memberIds: 1, startAt: 1 });
ScheduleSchema.index({ streamerName: 1, startAt: 1 });
ScheduleSchema.index({ member: 1, startAt: 1 });
