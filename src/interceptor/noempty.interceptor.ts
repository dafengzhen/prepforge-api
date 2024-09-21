import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

/**
 * NoEmptyInterceptor.
 *
 * @author dafengzhen
 */
export class NoEmptyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((data) => this.removeNullAndUndefinedValues(data)));
  }

  private removeNullAndUndefinedValues(data: Record<string, any> | any[]): any {
    if (Array.isArray(data)) {
      return data
        .map((item) => this.removeNullAndUndefinedValues(item))
        .filter(isNotNullOrUndefined);
    } else if (data && typeof data === 'object' && !(data instanceof Date)) {
      return Object.fromEntries(
        Object.entries(data)
          .map(([key, value]) => [
            key,
            this.removeNullAndUndefinedValues(value),
          ])
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([_, value]) => isNotNullOrUndefined(value)),
      );
    }
    return data;
  }
}

/**
 * Checks if a value is not null or undefined.
 *
 * @param value - The value to check.
 * @returns True if the value is neither null nor undefined.
 */
function isNotNullOrUndefined(value: any) {
  return value !== null && value !== undefined;
}
