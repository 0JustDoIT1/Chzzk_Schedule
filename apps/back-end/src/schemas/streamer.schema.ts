import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StreamerDocument = HydratedDocument<Streamer>;

@Schema({ collection: 'streamer', timestamps: true })
export class Streamer {
  @Prop({ required: true, type: Boolean })
  isOfficial: boolean;

  @Prop({ required: true, unique: true, type: String })
  name: string;

  @Prop({ required: true, unique: true, type: String })
  chzzkLink: string;

  @Prop({ type: String, unique: true, sparse: true })
  channelId?: string;

  @Prop({ type: Types.ObjectId, unique: true, sparse: true })
  publicationSubmissionId?: Types.ObjectId;

  @Prop({ required: false, type: () => [String] })
  tag?: string[];
}

export const StreamerSchema = SchemaFactory.createForClass(Streamer);
