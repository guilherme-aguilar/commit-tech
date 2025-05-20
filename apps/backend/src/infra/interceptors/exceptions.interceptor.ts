import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Recuperando o correlationId dos headers da requisição
    const correlationId = request.headers['x-correlation-id'];

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse() instanceof Object
        ? (exception.getResponse() as any).message || exception.message
        : exception.message
      : 'Internal Server Error';

    const errorResponse = {
      statusCode: status,
      message: Array.isArray(message) ? message.join(', ') : message,
      path: request.url,
      method: request.method,
      correlationId: correlationId,  // Incluindo o correlation ID na resposta de erro
    };

    // Logando o erro com o correlation ID e o stack trace
    this.logger.error(
      `HTTP ${status} - ${request.method} ${request.url} - ${message} correlationId=${correlationId}`,
      exception.stack,
    );

    if (response.status) {
      response.status(status).send(errorResponse);
    } else {
      response.code(status).send(errorResponse);
    }
  }
}