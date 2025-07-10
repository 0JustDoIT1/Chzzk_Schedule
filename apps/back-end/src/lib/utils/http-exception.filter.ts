import { Request, Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { BaseException } from 'src/lib/exceptions';
import { UnCatchedException } from 'src/lib/exceptions/uncatch.exception';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';

@Catch(BaseException, MongoServerError, mongoose.Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // MongoServerError 처리
    if (exception instanceof MongoServerError) {
      if (exception.code === 11000) {
        const field = Object.keys(exception.keyValue)[0];
        return response.status(409).json({
          errorCode: 'DUPLICATE_KEY',
          statusCode: 409,
          message: `${field} 값이 이미 존재합니다.`,
          path: request.url,
          timestamp: new Date().toISOString(),
        });
      }

      // 기타 MongoServerError 처리
      return response.status(500).json({
        errorCode: 'DB_ERROR',
        statusCode: 500,
        message: '데이터베이스 오류가 발생했습니다.',
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    if (exception instanceof mongoose.Error.ValidationError) {
      return response.status(400).json({
        errorCode: 'VALIDATION_ERROR',
        statusCode: 400,
        message: exception.message,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    // 기존 BaseException 처리
    if (exception instanceof BaseException) {
      return response.status(exception.statusCode).json({
        errorCode: exception.errorCode,
        statusCode: exception.statusCode,
        message: exception.message,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    // unhandled error => uncatchedException
    const uncaught = new UnCatchedException();
    return response.status(uncaught.statusCode).json({
      errorCode: uncaught.errorCode,
      statusCode: uncaught.statusCode,
      message: uncaught.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
