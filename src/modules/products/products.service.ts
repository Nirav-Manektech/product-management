import {
  IProduct,
  IProductDoc,
  NewCreatedContact,
  QueryFilter,
} from '@/modules/products/products.interface';
import mongoose, { FilterQuery } from 'mongoose';
import { Product } from '@/modules/products/products.model';
import responseCodes from '@/shared/utils/responseCode/responseCode';
import { ApiError } from '@/shared/utils/errors';
import { defaultStatus } from '@/shared/utils/responseCode/httpStatusAlias';
import { PaginateOptions } from '@/shared/utils/plugins/paginate/paginate';

const { ProductsResponseCodes } = responseCodes;

export const createProduct = async (
  data: NewCreatedContact,
): Promise<IProductDoc> => {
  const existing = await Product.findOne({ title: data.title });

  if (existing)
    throw new ApiError(
      defaultStatus.BAD_REQUEST,
      'Product with this name already exists',
      true,
      '',
      ProductsResponseCodes.CONTACT_ALREADY_EXISTS,
    );

  const product = await Product.create({ ...data });
  return product;
};

export const getProductById = async (
  id: string,
): Promise<IProductDoc | null> => {
  const contact = await Product.findById(id).populate({
    path: 'source country state city',
    select: 'name',
  });
  if (!contact)
    throw new ApiError(
      defaultStatus.OK,
      'Contact not found',
      true,
      '',
      ProductsResponseCodes.CONTACT_NOT_FOUND,
    );

  return contact;
};

export const updateProduct = async (
  id: string,
  updateData: Partial<IProduct>,
): Promise<boolean | null> => {
  let product: boolean | null;

  try {
    product = await Product.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      updateData,
      { new: true },
    );
  } catch (_error) {
    throw new ApiError(
      defaultStatus.OK,
      'Failed to update contact',
      true,
      '',
      ProductsResponseCodes.CONTACT_ERROR,
    );
  }

  if (!product)
    throw new ApiError(
      defaultStatus.OK,
      'Contact not found',
      true,
      '',
      ProductsResponseCodes.CONTACT_NOT_FOUND,
    );

  return true;
};

export const queryProducts = async (
  rawFilter: QueryFilter,
  options: PaginateOptions,
) => {
  const { search, ...baseFilters } = rawFilter;

  const filter: FilterQuery<IProduct> = { ...baseFilters };

  if (search && typeof search === 'string')
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

  const products = await Product.paginate(filter, options);
  return products;
};

export const deleteProduct = async (id: string): Promise<boolean | null> => {
  let product: boolean | null;
  try {
    product = await Product.findByIdAndDelete(id);
  } catch (_error) {
    throw new ApiError(
      defaultStatus.OK,
      'Failed to delete product',
      true,
      '',
      ProductsResponseCodes.COMPANY_ERROR,
    );
  }

  if (!product)
    throw new ApiError(
      defaultStatus.OK,
      'Products not found',
      true,
      '',
      ProductsResponseCodes.COMPANY_NOT_FOUND,
    );

  return true;
};
