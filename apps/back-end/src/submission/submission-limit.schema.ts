import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'submission_limits' })
export class SubmissionLimit {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  count: number;

  @Prop({ required: true })
  expiresAt: Date;
}

export const SubmissionLimitSchema = SchemaFactory.createForClass(SubmissionLimit);
SubmissionLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
