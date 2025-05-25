import { NotFoundException } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { BaseDocument } from './base.schema';
import { PaginateDto } from '../dto/pagination/paginate-sort-dto';
import { PaginateResultDto } from '../dto/pagination/paginate-result-dto';

export abstract class BaseService<T extends BaseDocument> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async create(createDto: Partial<T>, userId?: string): Promise<T> {
    // Add audit fields if userId is provided
    if (userId) {
      createDto.createdBy = userId;
      createDto.updatedBy = userId;
    }

    return this.repository.create(createDto);
  }

  async findById(id: string, checkIfExists = true): Promise<T> {
    const entity = await this.repository.findById(id);

    if (checkIfExists && !entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }

    return entity as T;
  }

  async findAll(filter = {}): Promise<T[]> {
    return this.repository.findAll(filter);
  }

  async findWithPagination(paginationDto: PaginateDto, filter = {}): Promise<PaginateResultDto<T>> {
    return this.repository.findWithPagination(paginationDto, filter);
  }

  async update(id: string, updateDto: Partial<T>, userId?: string): Promise<T> {
    // Add audit fields if userId is provided
    if (userId) {
      updateDto.updatedBy = userId;
      updateDto.updatedAt = new Date();
    }

    const updated = await this.repository.updateById(id, updateDto);

    if (!updated) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }

    return updated;
  }

  async remove(id: string): Promise<T> {
    const deleted = await this.repository.deleteById(id);

    if (!deleted) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }

    return deleted;
  }

  async softDelete(id: string, userId: string): Promise<T> {
    const deleted = await this.repository.softDeleteById(id, userId);

    if (!deleted) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }

    return deleted;
  }
}
