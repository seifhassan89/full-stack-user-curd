import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
export type TSortDirection = 'ASC' | 'DESC';

export class PaginateDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @ApiProperty({
    type: Number,
    default: 1,
    description: 'The page number to fetch',
  })
  pageNumber?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @ApiProperty({
    type: Number,
    default: 10,
    description: 'The number of records to fetch per page',
  })
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    default: 'id',
    description: 'The field to sort the records by',
  })
  sortBy?: string = 'id';

  @ApiProperty({
    type: String,
    enum: ['ASC', 'DESC'],
    default: 'ASC',
    description: 'The direction to sort the records in',
  })
  @IsOptional()
  @IsString()
  sortOrder?: TSortDirection = 'ASC';

  constructor(partial: Partial<PaginateDto>) {
    Object.assign(this, partial);
  }
}
