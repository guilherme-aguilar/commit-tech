import { CallHandler, ExecutionContext, Injectable, LoggerService, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';  // Usado para gerar o correlation ID

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  // Função para gerar um Correlation ID único
  private generateCorrelationId(): string {
    return crypto.randomBytes(16).toString('hex'); // Gera um ID único em formato hexadecimal
  }

  private getIP(request: any): string {
    let ip: string;
    const ipAddr = request.headers['x-forwarded-for'];
    if (ipAddr) {
      const list = ipAddr.split(',');
      ip = list[list.length - 1];
    } else {
      ip = request.socket.remoteAddress;
    }
    return ip.replace('::ffff:', '');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    // Gerar um Correlation ID único para a requisição e passar no header
    const correlationId = this.generateCorrelationId();
    request.headers['x-correlation-id'] = correlationId; // Adicionando o correlation ID ao header da requisição

    const ip = this.getIP(request);

    // Logando o início da requisição com o correlation ID
    this.logger.log(
      `Incoming Request on ${request.url}`,
      `correlationId=${correlationId} method=${request.method} ip=${ip}`,
      {
        
      }
    );

    return next.handle().pipe(
      tap(() => {
        // Logando o fim da requisição com o correlation ID
        this.logger.log(
          `End Request for ${request.url}`,
          `correlationId=${correlationId} method=${request.method} ip=${ip} duration=${Date.now() - now}ms`
        );
      })
    );
  }
}
