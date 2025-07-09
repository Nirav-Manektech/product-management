import express, { Router } from 'express';

import * as productsController from '@/modules/products/products.controller';
import { validateMiddleware } from '@/shared/utils/middlewares';
import { createProduct } from './products.validation';

const router: Router = express.Router();

router
  .route('/')
  .get(productsController.getContacts)
  .post(
    validateMiddleware(createProduct(false)),
    productsController.createProduct,
  );

router
  .route('/:id')
  .get(productsController.getContactById)
  .patch(productsController.updateProduct)
  .delete(productsController.deleteProductById);

export default router;
