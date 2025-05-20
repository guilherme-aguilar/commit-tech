import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { CustomLogger } from './custom.logger';
import { LoggerModule } from 'nestjs-pino';
import * as path from 'path';
import * as fs from 'fs';

// Diretório para armazenar logs
const logDirectory = path.join(process.cwd(), './logs');

// Certifique-se de que o diretório existe
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

@Global()
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false, // Desabilita logs automáticos de requisição
        transport: {
          targets: [
            {
              // Configuração do `pino-roll` para rotação de arquivos
              target: 'pino-roll',
              options: {
                file: path.join(logDirectory, `app-${new Date().toISOString().split('T')[0]}.log`), // Define o padrão de nomes para arquivos                
                frequency: 86400000, // Rotação diária (24h em milissegundos)
                maxFiles: 7, // Mantém no máximo 7 arquivos de log
                size: '100M', // Tamanho máximo de cada arquivo (opcional)
                compress: true, // Comprime arquivos antigos (gzip)
                sufix: false

              },
            },
            {
              // Logs formatados no console
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'yyyy-dd-mm, h:MM:ss TT',
              },
            },
          ],
        },
      },
    }),
  ],
  providers: [LoggerService, CustomLogger],
  exports: [LoggerService, CustomLogger],
})
export class LocalLoggerModule {}
