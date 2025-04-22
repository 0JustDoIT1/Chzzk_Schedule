import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StreamerDocument = Streamer & Document;

@Schema({ collection: 'streamer' })
export class Streamer {
  @Prop({ required: true, unique: true, type: String })
  name: string;

  @Prop({ required: true, unique: true, type: String })
  chzzkLink: string;

  @Prop({ required: false, type: String })
  mcn?: string;

  @Prop({ required: false, type: () => [String] })
  tag?: string[];
}

export const StreamerSchema = SchemaFactory.createForClass(Streamer);
