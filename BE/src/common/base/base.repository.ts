import { FilterQuery, Model, ProjectionType, QueryOptions, SortOrder, UpdateQuery } from 'mongoose';
import { PaginateResultDto } from '../dto/pagination/paginate-result-dto';
import { PaginateDto } from '../dto/pagination/paginate-sort-dto';
import { BaseDocument } from './base.schema';

export abstract class BaseRepository<T extends BaseDocument> {
  constructor(protected readonly model: Model<T>) {}

  async create(createDto: Partial<T>): Promise<T> {
    const createdEntity = new this.model(createDto);
    return createdEntity.save();
  }

  async findById(
    id: string,
    projection?: ProjectionType<Partial<T>> | null | undefined,
  ): Promise<T | null> {
    return this.model.findById(id, projection).exec();
  }

  async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<Partial<T>> | null | undefined,
    options?: QueryOptions,
  ): Promise<T | null> {
    return this.model.findOne(filter, projection, options).exec();
  }

  async findAll(
    filter: FilterQuery<T> = {},
    projection?: ProjectionType<Partial<T>> | null | undefined,
    options?: QueryOptions,
  ): Promise<T[]> {
    return this.model.find(filter, projection, options).exec();
  }

  async findWithPagination(
    paginationDto: PaginateDto,
    filter: FilterQuery<T> = {},
    projection?: ProjectionType<Partial<T>> | null | undefined,
  ): Promise<PaginateResultDto<T>> {
    const { pageNumber = 1, pageSize = 10, sortBy = 'id', sortOrder = 'ASC' } = paginationDto;
    const skip = (pageNumber - 1) * pageSize;

    const sort: { [key: string]: SortOrder } = { [sortBy]: sortOrder === 'ASC' ? 1 : -1 };

    const [items, totalItems] = await Promise.all([
      this.model.find(filter, projection).sort(sort).skip(skip).limit(pageSize).exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return new PaginateResultDto<T>(
      items,
      totalItems,
      pageNumber,
      pageSize,
      Math.ceil(totalItems / pageSize),
    );
  }

  async updateById(id: string, updateDto: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async updateOne(filter: FilterQuery<T>, updateDto: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, updateDto, { new: true }).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async softDeleteById(id: string, userId: string): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        {
          $set: {
            deletedAt: new Date(),
            deletedBy: userId,
          },
        },
        { new: true },
      )
      .exec();
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
