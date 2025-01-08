import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    //logging the methods called
    console.log(`Incoming Request: ${request.method} ${request.url}`); 
    
    //Handling request and logging time taken to process
    return next.handle().pipe(
      tap(() => console.log(`Request processed in ${Date.now() - now}ms`)) 
    );
  }
}
