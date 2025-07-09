// src/modules/contact/contacts.model.ts

import { Schema, model } from 'mongoose';
import { paginate, toJSON } from '@/shared/utils/plugins/index';
import {
  IProductDoc,
  IProductModel,
} from '@/modules/products/products.interface';

const productSchema = new Schema<IProductDoc>(
  {
    title: { type: String, required: true, trim: true },
    manufacturer: { type: String, required: true, trim: true },
    stock: [
      {
        color: { type: String, required: true, trim: true },
        stock: { type: Number, required: true },
        price: { type: Number, required: true },
        size: { type: String, trim: true },
        image: [{ type: String, required: true, trim: true }],
      },
    ],
    isShippingFree: { type: Boolean, default: false },
    discountPercentage: { type: Number, default: 0 },
    warrantyYear: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    category: { type: String, required: true, trim: true },
    isPremiumQuality: { type: Boolean, default: false },
    keyFeatures: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  },
);

productSchema.plugin(toJSON);
productSchema.plugin(paginate);

export const Product = model<IProductDoc, IProductModel>(
  'Product',
  productSchema,
);
