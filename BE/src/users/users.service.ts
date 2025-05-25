import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { BaseService } from 'src/common/base/base.service';
import { PaginateResultDto } from 'src/common/dto/pagination/paginate-result-dto';
import { PasswordHelper } from 'src/common/utils/password.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { User } from './schemas/user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(private readonly usersRepository: UsersRepository) {
    super(usersRepository);
  }

  async create(createUserDto: CreateUserDto, createdBy?: string): Promise<User> {
    // Check if user with the same email already exists
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    if (createUserDto.password) {
      createUserDto.password = await PasswordHelper.hashPassword(createUserDto.password);
    }

    let userEntity: Partial<User> = { ...createUserDto };
    // Add audit fields
    if (createdBy) {
      userEntity = {
        ...userEntity,
        createdBy,
        createdAt: new Date(),
        updatedBy: createdBy,
        updatedAt: new Date(),
      };
    }
    return this.usersRepository.create(userEntity);
  }

  async update(id: string, updateUserDto: UpdateUserDto, updatedBy?: string): Promise<User> {
    // Check if user exists
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Hash password if it's being updated
    if (updateUserDto.password) {
      updateUserDto.password = await PasswordHelper.hashPassword(updateUserDto.password);
    }
    let updatedUserEntity: Partial<User> = { ...updateUserDto };

    // Add audit fields
    if (updatedBy) {
      updatedUserEntity = {
        ...updatedUserEntity,
        updatedBy,
        updatedAt: new Date(),
      };
    }

    const updatedUser = await this.usersRepository.updateById(id, updatedUserEntity);
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<User> {
    // Check if user exists
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updatedUser = await this.usersRepository.updateById(id, {
      refreshToken: refreshToken ?? undefined,
    });
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneByEmail(email);
  }

  async findAllWithFilters(queryDto: UserQueryDto): Promise<PaginateResultDto<User>> {
    const filter: FilterQuery<User> = {};

    // Add filters based on queryDto
    if (queryDto.search) {
      filter.$or = [
        { fullName: { $regex: queryDto.search, $options: 'i' } },
        { email: { $regex: queryDto.search, $options: 'i' } },
      ];
    }

    if (queryDto.role) {
      filter.role = queryDto.role;
    }

    if (queryDto.status) {
      filter.status = queryDto.status;
    }

    // Only return non-deleted users unless explicitly requested
    if (!queryDto.includeDeleted) {
      filter.deletedAt = { $exists: false };
    }

    // Use the paginationDto to fetch paginated results
    return this.usersRepository.findWithPagination(queryDto, filter);
  }
}
