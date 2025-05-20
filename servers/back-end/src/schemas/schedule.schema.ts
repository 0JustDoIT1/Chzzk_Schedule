import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category } from 'src/lib/constants/schedule-category';

export type ScheduleDocument = Schedule & Document;

@Schema({ collection: 'schedule', timestamps: true })
export class Schedule {
  @Prop({ required: true, type: Boolean })
  isOfficial: boolean;

  @Prop({ required: false, type: String })
  streamer?: string;

  @Prop({ required: true, enum: Category })
  category: Category;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: false, type: () => [String] })
  member?: string[];

  @Prop({ required: true, type: Date })
  startAt: Date;

  @Prop({ required: true, type: Date })
  endAt: Date;

  @Prop({ required: false, type: String })
  contents?: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
