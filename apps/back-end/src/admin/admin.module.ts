import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminLoginLimit, AdminLoginLimitSchema } from './admin-login.schema';
import { AdminService } from './admin.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: AdminLoginLimit.name, schema: AdminLoginLimitSchema }])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
