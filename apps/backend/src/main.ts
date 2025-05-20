import { NestFactory } from '@nestjs/core';
import { AppV1Module } from './app.module';
import { CustomLogger } from './infra/services/logger/custom.logger';
import { GlobalExceptionFilter } from './infra/interceptors/exceptions.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppV1Module);

  // Obtém antes de qualquer log
  const logger = app.get(CustomLogger);
  
  // Usa o logger ANTES da inicialização
  app.useLogger(logger);

   // Registrar o filtro global de exceções
   app.useGlobalFilters(new GlobalExceptionFilter());

  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
