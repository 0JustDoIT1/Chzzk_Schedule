import { HttpException, HttpStatus, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { Model } from 'mongoose';
import { AdminLoginLimit } from './admin-login.schema';
import { issueAdminSession } from './admin-session';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const locked = () => new HttpException('로그인 시도가 많습니다. 잠시 후 다시 시도해 주세요.', HttpStatus.TOO_MANY_REQUESTS);

@Injectable()
export class AdminService {
  constructor(@InjectModel(AdminLoginLimit.name) private readonly limits: Model<AdminLoginLimit>) {}

  async login(username: string, password: string, clientIp: string) {
    const account = process.env.ADMIN_REVIEW_USERNAME;
    const expectedPassword = process.env.ADMIN_REVIEW_PASSWORD;
    const secret = process.env.ADMIN_WRITE_TOKEN;
    if (!account || !expectedPassword || expectedPassword.length < 32 || !secret || secret.length < 32) {
      throw new ServiceUnavailableException('Admin account is not configured');
    }
    const windowStart = Math.floor(Date.now() / WINDOW_MS) * WINDOW_MS;
    const key = createHmac('sha256', secret).update(`admin-login:${windowStart}:${clientIp}`).digest('hex');
    const current = await this.limits.findOne({ key }).lean().exec();
    if (current && current.count >= MAX_FAILURES) throw locked();

    const supplied = Buffer.from(password);
    const expected = Buffer.from(expectedPassword);
    const valid = username === account && supplied.length === expected.length && timingSafeEqual(supplied, expected);
    if (!valid) {
      try {
        await this.limits.findOneAndUpdate(
          { key, count: { $lt: MAX_FAILURES } },
          { $inc: { count: 1 }, $setOnInsert: { key, expiresAt: new Date(windowStart + 2 * WINDOW_MS) } },
          { upsert: true, new: true },
        ).exec();
      } catch (error) {
        if ((error as { code?: number }).code === 11000) throw locked();
        throw error;
      }
      throw new UnauthorizedException('로그인 정보를 확인해 주세요.');
    }
    return { token: issueAdminSession(account, secret), expiresIn: 8 * 60 * 60 };
  }
}
