import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { SwaggerApiDocumentation } from '../common/decorators/swagger-api-documentation.decorator';
import { PaginateResultDto } from '../common/dto/pagination/paginate-result-dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  @SwaggerApiDocumentation({
    summary: 'Create a new user (Admin only)',
    modelType: UserResponseDto,
  })
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser('id') userId: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto, userId);
    return plainToClass(UserResponseDto, user.toObject());
  }

  @Get()
  @Roles('admin')
  @ApiQuery({ type: UserQueryDto })
  @SwaggerApiDocumentation({
    summary: 'Get all users with pagination (Admin only)',
    modelType: UserResponseDto,
    isPagination: true,
    isArray: true,
  })
  async findAll(@Query() queryDto: UserQueryDto): Promise<PaginateResultDto<UserResponseDto>> {
    const result = await this.usersService.findAllWithFilters(queryDto);
    const userResponses: UserResponseDto[] = result.data.map(user =>
      plainToClass(UserResponseDto, user.toObject()),
    );
    return new PaginateResultDto<UserResponseDto>(
      userResponses,
      result.totalCount,
      result.currentPage,
      result.pageSize,
      result.totalPages,
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'User ID' })
  @SwaggerApiDocumentation({
    summary: 'Get user by ID',
    modelType: UserResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    return plainToClass(UserResponseDto, user.toObject());
  }

  @Get('profile/me')
  @SwaggerApiDocumentation({
    summary: 'Get current user profile',
    modelType: UserResponseDto,
  })
  async getProfile(@CurrentUser('id') userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(userId);
    return plainToClass(UserResponseDto, user.toObject());
  }

  @Put(':id')
  @Roles('admin')
  @ApiParam({ name: 'id', description: 'User ID' })
  @SwaggerApiDocumentation({
    summary: 'Update user by ID (Admin only)',
    modelType: UserResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('id') userId: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto, userId);
    return plainToClass(UserResponseDto, user.toObject());
  }

  @Delete(':id')
  @Roles('admin')
  @ApiParam({ name: 'id', description: 'User ID' })
  @SwaggerApiDocumentation({
    summary: 'Soft delete a user by ID (Admin only)',
    modelType: UserResponseDto,
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.softDelete(id, userId);
    return plainToClass(UserResponseDto, user.toObject());
  }
}
