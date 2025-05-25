import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './enums/user-role.enum';
import { UserStatus } from './enums/user-status.enum';
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Exclude()
  createdAt?: Date;

  @Exclude()
  updatedAt?: Date;

  @Exclude()
  __v?: number;
}
