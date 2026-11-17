import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';
import { Request } from 'express';
import { verifyAdminSession } from '../../admin/admin-session';

@Injectable()
export class AdminWriteGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const secret = process.env.ADMIN_WRITE_TOKEN;
    const username = process.env.ADMIN_REVIEW_USERNAME;
    const request = context.switchToHttp().getRequest<Request & { adminActor?: string }>();
    const authorization = request.headers.authorization;

    // Fail closed until a dedicated admin login is implemented.
    if (!secret || secret.length < 32 || !authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const supplied = authorization.slice('Bearer '.length);
    const expectedBytes = Buffer.from(secret);
    const suppliedBytes = Buffer.from(supplied);
    const serviceTokenValid = suppliedBytes.length === expectedBytes.length && timingSafeEqual(suppliedBytes, expectedBytes);
    if (!serviceTokenValid && (!username || !verifyAdminSession(supplied, username, secret))) {
      throw new UnauthorizedException();
    }

    request.adminActor = serviceTokenValid ? 'service-token' : username;

    return true;
  }
}
