import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SubmissionDocument = HydratedDocument<Submission>;
export type SubmissionKind = 'streamer' | 'schedule' | 'schedule-edit';
export type SubmissionStatus = 'pending' | 'processing' | 'approved' | 'rejected';

@Schema({ collection: 'submissions', timestamps: true })
export class Submission {
  @Prop({ required: true, enum: ['streamer', 'schedule', 'schedule-edit'] })
  kind: SubmissionKind;

  @Prop({ required: true, enum: ['pending', 'processing', 'approved', 'rejected'], default: 'pending' })
  status: SubmissionStatus;

  @Prop({ required: true, type: Object })
  payload: Record<string, unknown>;

  @Prop({ required: true, type: String })
  sourceUrl: string;

  @Prop({ required: true, unique: true, type: String })
  receiptToken: string;

  @Prop({ type: Types.ObjectId, ref: 'Schedule' })
  targetScheduleId?: Types.ObjectId;

  @Prop({ type: String })
  reason?: string;

  @Prop({ type: Date })
  reviewedAt?: Date;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
