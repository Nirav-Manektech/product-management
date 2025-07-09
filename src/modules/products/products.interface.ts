// src/modules/contact/contacts.interface.ts

import { Document } from 'mongoose';
import { IPaginateModel } from '@/shared/interfaces/model.interface';
import { AuditFields } from '@/shared/types/common';

export interface IProductStock {
  color: string;
  stock: number;
  price: number;
  image: string[];
}
export interface QueryFilter {
  search?: string;
  company?: string;
  companyId?: string;
  source?: string;
  [key: string]: unknown;
}

export interface IProductBase {
  title: string;
  manufacturer: string;
  stock: IProductStock[];
  isShippingFree: boolean;
  discountPercentage: number;
  warrantyYear: number;
  rating: number;
  category: string;
  isPremiumQuality: boolean;
  keyFeatures: string[];
  description: string;
}

export interface IProduct extends IProductBase, AuditFields {}

export interface IProductDoc extends IProduct, Document {}

export interface IProductModel extends IPaginateModel<IProductDoc> {}

export type NewCreatedContact = IProductBase &
  Partial<Pick<AuditFields, 'createdBy' | 'updatedBy'>>;

export type UpdateContactBody = Partial<IProduct>;
