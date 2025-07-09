import { generateJoiValidation } from '@/shared/validations/generateJoiValidation';
import { Product } from './products.model';
import Joi from 'joi';

export const createProduct = (isUpsert: boolean) => {
  const base = generateJoiValidation(Product.schema, isUpsert);

  const override = base.keys({
    stock: Joi.array().items(
      Joi.object({
        color: Joi.string().required(),
        stock: Joi.number().required(),
        price: Joi.number().required(),
        size: Joi.string().optional(),
        image: Joi.string().uri().required(),
      }),
    ),
  });

  return { body: override };
};
