/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizePipe implements PipeTransform {
  private isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  private sanitize(values: any) {
    if (this.isObject(values)) {
      Object.keys(values).forEach(key => {
        if (typeof values[key] === 'string') {
          values[key] = sanitizeHtml(values[key], {
            allowedTags: [],
            allowedAttributes: {},
          });
        } else if (this.isObject(values[key]) || Array.isArray(values[key])) {
          values[key] = this.sanitize(values[key]);
        }
      });
    } else if (Array.isArray(values)) {
      values.forEach((value, index) => {
        if (typeof value === 'string') {
          values[index] = sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {},
          });
        } else if (this.isObject(value) || Array.isArray(value)) {
          values[index] = this.sanitize(value);
        }
      });
    }
    return values;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'body' || type === 'query') {
      return this.sanitize(value);
    }
    return value;
  }
}
