import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserStatus } from './enums/user-status.enum';
import { UserRole } from './enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description:
      'User password - must contain at least 8 characters, one letter, one number and one special character',
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'Password must contain at least one letter, one number, and one special character',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either admin or user' })
  role?: string = UserRole.USER;

  @ApiPropertyOptional({
    description: 'User status',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status must be either active or inactive' })
  status?: string = UserStatus.ACTIVE;
}
