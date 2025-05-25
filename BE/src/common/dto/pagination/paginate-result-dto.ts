import { ApiProperty } from '@nestjs/swagger';

export class PaginateResultDto<T> {
  @ApiProperty({
    description: 'page data array',
    isArray: true,
  })
  data: T[];
  @ApiProperty({
    type: Number,
    description: 'Total number of records',
  })
  totalCount: number;
  @ApiProperty({ type: Number, description: 'Current page number' })
  currentPage: number;
  @ApiProperty({ type: Number, description: 'Number of records per page' })
  pageSize: number;
  @ApiProperty({ type: Number, description: 'Total number of pages' })
  totalPages: number;
  @ApiProperty({ type: Boolean, description: 'Success status' })
  isSuccess: boolean;
  constructor(
    data: T[],
    totalCount: number,
    currentPage: number,
    pageSize: number,
    totalPages: number,
  ) {
    this.data = data;
    this.isSuccess = true;
    this.totalCount = totalCount;
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.totalPages = totalPages;
  }
}
