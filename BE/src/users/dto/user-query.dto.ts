import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginateDto } from 'src/common/dto/pagination/paginate-sort-dto';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class UserQueryDto extends PaginateDto {
  @ApiPropertyOptional({
    description: 'Search by name or email',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by role',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either admin or user' })
  role?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: UserStatus,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status must be either active or inactive' })
  status?: string;

  @ApiPropertyOptional({
    description: 'Include soft-deleted users',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  includeDeleted?: boolean = false;
}
