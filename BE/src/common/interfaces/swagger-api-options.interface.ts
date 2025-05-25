import { Type } from '@nestjs/common';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SwaggerApiOptions<TModel extends Type<any>> {
  summary: string;
  modelType: TModel;
  isArray?: boolean;
  isPagination?: boolean;
}
