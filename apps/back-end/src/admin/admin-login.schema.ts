import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'admin_login_limits' })
export class AdminLoginLimit {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  count: number;

  @Prop({ required: true })
  expiresAt: Date;
}

export const AdminLoginLimitSchema = SchemaFactory.createForClass(AdminLoginLimit);
AdminLoginLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
