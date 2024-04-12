import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

/**
 * APi logging interceptor
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url, body } = context.getArgByIndex(0);
    this.logger.log(`Request ${method} ${url} ${JSON.stringify(body)}`);

    return next
      .handle()
      .pipe(
        tap((data) =>
          this.logger.log(`Response ${method} ${url} ${JSON.stringify(data)}`),
        ),
      );
  }
}
