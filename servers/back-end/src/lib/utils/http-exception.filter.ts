import { Request, Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { BaseException } from 'src/lib/exceptions';
import { UnCatchedException } from 'src/lib/exceptions/uncatch.exception';

@Catch(BaseException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { errorCode, statusCode, message } =
      exception instanceof BaseException ? exception : new UnCatchedException();

    response.status(statusCode).json({
      errorCode: errorCode,
      statusCode: statusCode,
      message: message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
