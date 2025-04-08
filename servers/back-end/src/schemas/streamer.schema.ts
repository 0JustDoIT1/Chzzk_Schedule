import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StreamerDocument = Streamer & Document;

@Schema()
export class Streamer {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  sounds: string[];
}

export const StreamerSchema = SchemaFactory.createForClass(Streamer);
