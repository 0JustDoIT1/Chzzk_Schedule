import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AllCategory } from '@shared/constants';
import { HydratedDocument, Types } from 'mongoose';

export type ScheduleDocument = HydratedDocument<Schedule>;

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

  @Prop({ required: true, type: Boolean })
  fullDay: boolean;

  @Prop({ required: true, type: Date })
  startAt: Date;

  @Prop({ required: true, type: Date })
  endAt: Date;

  @Prop({ required: false, type: String })
  contents?: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
