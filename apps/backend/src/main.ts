import { NestFactory } from '@nestjs/core';
import { AppV1Module } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppV1Module);

  app.setGlobalPrefix('api/v1');
  
  app.getHttpAdapter().get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();