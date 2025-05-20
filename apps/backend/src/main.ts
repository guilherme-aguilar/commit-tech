import { NestFactory } from '@nestjs/core';
import { AppV1Module } from './app.module';
import { CustomLogger } from './infra/services/logger/custom.logger';
import { GlobalExceptionFilter } from './infra/interceptors/exceptions.interceptor';
import { HttpResponseInterceptor } from './infra/interceptors/httpResponse.interceptor';
import { LoggerService } from './infra/services/logger/logger.service';
import { LoggingInterceptor } from './infra/interceptors/logger.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppV1Module);

  app.setGlobalPrefix('api/v1');
  
  app.getHttpAdapter().get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();