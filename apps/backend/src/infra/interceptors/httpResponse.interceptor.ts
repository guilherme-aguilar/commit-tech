import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export class ResponseFormat<T> {
  isArray: boolean;
  path: string;
  duration: string;
  method: string;
  message?: string;
  statusCode?: number;
  data: T;
}
@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    return next.handle().pipe(
      map((data) => ({
        data,
        isArray: Array.isArray(data),
        path: request.url,
        duration: `${Date.now() - now}ms`,
        method: request.method,
      })),
      
    );
  }
}
