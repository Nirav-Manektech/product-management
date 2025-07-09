import { Types } from 'mongoose';

export interface AuditFields {
  createdAt?: Date;
  updatedAt?: Date;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

type ValueOf<T> = T[keyof T];
