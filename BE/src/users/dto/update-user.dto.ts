import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from './enums/user-role.enum';
import { UserStatus } from './enums/user-status.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiPropertyOptional({
    description:
      'User password - must contain at least 8 characters, one letter, one number and one special character',
    example: 'Password123!',
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'Password must contain at least one letter, one number, and one special character',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either admin or user' })
  role?: string;

  @ApiPropertyOptional({
    description: 'User status',
    enum: UserStatus,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status must be either active or inactive' })
  status?: string;
}
