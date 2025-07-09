import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import httpStatus from 'http-status';
import ApiError from '@/shared/utils/errors/ApiError.js';

type SchemaMap = {
  body?: ObjectSchema;
  query?: ObjectSchema;
  params?: ObjectSchema;
};

const validate =
  (schemas: SchemaMap) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const validationTargets: (keyof SchemaMap)[] = ['body', 'query', 'params'];

    for (const key of validationTargets)
      if (schemas[key]) {
        const { error, value } = schemas[key]!.validate(req[key], {
          abortEarly: false,
          errors: { label: 'key' },
        });

        if (error) {
          const errorMessage = error.details.map((d) => d.message).join(', ');
          return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        }

        // Avoid directly overwriting `req.query` if it's not allowed
        if (key === 'query')
          Object.assign(req.query, value); // merges values safely
        else req[key] = value;
      }

    return next();
  };

export default validate;
