import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';
import { Request } from 'express';

@Injectable()
export class AdminWriteGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const secret = process.env.ADMIN_WRITE_TOKEN;
    const authorization = context.switchToHttp().getRequest<Request>().headers.authorization;

    // Fail closed until a dedicated admin login is implemented.
    if (!secret || secret.length < 32 || !authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const supplied = authorization.slice('Bearer '.length);
    const expectedBytes = Buffer.from(secret);
    const suppliedBytes = Buffer.from(supplied);
    if (
      suppliedBytes.length !== expectedBytes.length ||
      !timingSafeEqual(suppliedBytes, expectedBytes)
    ) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
