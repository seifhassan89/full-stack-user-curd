/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimStringPipe implements PipeTransform {
  private isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  private trim(values: any) {
    if (this.isObject(values)) {
      Object.keys(values).forEach(key => {
        if (typeof values[key] === 'string') {
          values[key] = values[key].trim();
        } else if (this.isObject(values[key]) || Array.isArray(values[key])) {
          values[key] = this.trim(values[key]);
        }
      });
    } else if (Array.isArray(values)) {
      values.forEach((value, index) => {
        if (typeof value === 'string') {
          values[index] = value.trim();
        } else if (this.isObject(value) || Array.isArray(value)) {
          values[index] = this.trim(value);
        }
      });
    }
    return values;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'body' || type === 'query' || type === 'param') {
      return this.trim(value);
    }
    return value;
  }
}
