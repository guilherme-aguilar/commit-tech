import { NestFactory } from '@nestjs/core';
import { AppV1Module } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppV1Module);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
