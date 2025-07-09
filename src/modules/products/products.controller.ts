// Create contact service functions
import { Request, Response } from 'express';
import * as productService from '@/modules/products/products.service';
import catchAsync from '@/shared/utils/catchAsync';
import responseCodes from '@/shared/utils/responseCode/responseCode';
import { pick } from '@/shared/utils';

const { ProductsResponseCodes } = responseCodes;

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.createProduct({
    ...req.body,
  });
  res.success(
    product,
    ProductsResponseCodes.SUCCESS,
    'Product Created Successfully',
  );
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = pick(req.params, ['id']);
  const updatedProduct = await productService.updateProduct(id, req.body);
  res.success(
    updatedProduct,
    ProductsResponseCodes.SUCCESS,
    'Product Updated Successfully',
  );
});

export const getContactById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = pick(req.params, ['id']);
    const product = await productService.getProductById(id);
    res.success(
      product,
      ProductsResponseCodes.SUCCESS,
      'Product Fetched Successfully',
    );
  },
);

export const getContacts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['search', 'category']);
  const options = pick(req.query, [
    'sortBy',
    'limit',
    'page',
    'fields',
    'populate',
    'includeTimeStamps',
    'alias',
    '',
  ]);

  const products = await productService.queryProducts(filter, options);
  res.success(
    products,
    ProductsResponseCodes.SUCCESS,
    'Products Fetched Successfully',
  );
});

export const deleteProductById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = pick(req.params, ['id']);

    const product = await productService.deleteProduct(id);
    res.success(
      product,
      ProductsResponseCodes.SUCCESS,
      'Product Deleted Successfully',
    );
  },
);
