import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CustomSerializerInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Add @UseCustomSerializer decorator to use this interceptor
    const useCustomSerializer = this.reflector.get<boolean>(
      'useCustomSerializer',
      context.getHandler(),
    );

    if (!useCustomSerializer) {
      return next.handle();
    }

    return next.handle().pipe(
      // Serialize bigint
      map((data) =>
        JSON.stringify(data, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      ),
    );
  }
}
