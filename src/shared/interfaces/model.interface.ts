import { Model, Document, FilterQuery, QueryOptions } from 'mongoose';

export interface IPaginateResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page?: number;
  totalPages?: number;
}

export interface IPaginateModel<T extends Document> extends Model<T> {
  paginate(query?: FilterQuery<T>, options?: QueryOptions & { page?: number; limit?: number }): Promise<IPaginateResult<T>>;
}
