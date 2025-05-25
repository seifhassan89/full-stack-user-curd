import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessApiResponse } from '../dto/api-response/success-api-response.dto';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, SuccessApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        // If data is already in SuccessApiResponse format, return it as is
        if (
          data &&
          typeof data === 'object' &&
          'isSuccess' in data &&
          typeof data.isSuccess === 'boolean'
        ) {
          return data;
        }

        // Wrap the data in a standard SuccessApiResponse
        return new SuccessApiResponse(data);
      }),
    );
  }
}
