import { ApiProperty } from '@nestjs/swagger';
import { BaseApiResponse } from './base-api-response.dto';

export class ErrorApiResponse extends BaseApiResponse<void> {
  @ApiProperty({ required: false, example: { field: ['error message'] } })
  errors?: Record<string, string[]>;

  @ApiProperty({ required: false, example: 'Error stack trace' })
  stack?: string;

  constructor(message?: string) {
    super();
    this.isSuccess = false;
    this.message = message;
  }
}
