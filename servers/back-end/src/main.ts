import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './lib/utils/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware Setting
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // Api global prefix setting
  app.setGlobalPrefix('v1');

  // CORS Setting
  app.enableCors({
    origin: [process.env.ORIGIN], // 프론트엔드 주소만 허용
    credentials: true, // 쿠키, 인증 헤더 사용 가능 여부
  });

  // Swagger Setting
  const config = new DocumentBuilder()
    .setTitle("0's Life API Docs")
    .setDescription('0군의 삶 API 문서입니다.')
    .setVersion('1.0.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
