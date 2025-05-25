import { ApiProperty } from '@nestjs/swagger';
export class BaseApiResponse<T> {
  @ApiProperty({ type: Boolean })
  isSuccess: boolean;
  @ApiProperty({ type: String })
  message?: string;
  @ApiProperty()
  data?: T;
}
