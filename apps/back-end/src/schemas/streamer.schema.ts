import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StreamerDocument = HydratedDocument<Streamer>;

@Schema({ collection: 'streamer', timestamps: true })
export class Streamer {
  @Prop({ required: true, type: Boolean })
  isOfficial: boolean;

  @Prop({ required: true, unique: true, type: String })
  name: string;

  @Prop({ required: true, unique: true, type: String })
  chzzkLink: string;

  @Prop({ required: false, type: () => [String] })
  tag?: string[];
}

export const StreamerSchema = SchemaFactory.createForClass(Streamer);
