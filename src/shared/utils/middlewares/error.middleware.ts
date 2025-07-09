import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import ApiError from '@/shared/utils/errors/ApiError.js';
import {
  defaultStatus,
  status,
} from '@/shared/utils/responseCode/httpStatusAlias.js';
import config from '@/shared/config/config.js';

/**
 * Type-guard for Mongo duplicate-key errors (code 11000).
 */
function isMongoDuplicateKeyError(
  err: unknown,
): err is mongoose.mongo.MongoServerError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as mongoose.mongo.MongoServerError).code === 11000
  );
}

/**
 * Convert any thrown error into an ApiError, mapping
 * Mongoose validation/cast/duplicate errors to proper HTTP codes.
 */
export function errorConverter(
  err: unknown,
  _req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (err instanceof ApiError) return next(err);

  // default to 500
  let statusCode: number = defaultStatus.INTERNAL_SERVER_ERROR;
  let message: string = status[statusCode] || 'Unexpected error';

  // Mongoose validation failure → 400 Bad Request
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = defaultStatus.BAD_REQUEST;
    message = err.message;
  }
  // Mongoose type/cast error → 400 Bad Request
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = defaultStatus.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  // Mongo duplicate-key (unique index) → 409 Conflict
  else if (isMongoDuplicateKeyError(err)) {
    statusCode = defaultStatus.CONFLICT;
    const field = Object.keys(err.keyValue || {}).join(', ');
    message = `Already exists ${field ? `: ${field}` : ''}`;
  } else if (err instanceof Error) {
    message = err.message;
  }

  const apiError = new ApiError(
    statusCode,
    message,
    true,
    err instanceof Error ? err.stack : undefined,
  );
  next(apiError);
}

/**
 * Final Express error handler: sends the ApiError as JSON.
 */
export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // start with values from the error
  let statusCode: number = err.statusCode;
  let errorCode: number = err.errorCode;
  let message: string = err.message;

  // in production, hide internal errors
  if (config.env === 'production' && !err.isOperational) {
    errorCode = defaultStatus.INTERNAL_SERVER_ERROR;
    message =
      status[defaultStatus.INTERNAL_SERVER_ERROR] || 'Internal Server Error';
  }

  // build the payload
  const payload: Record<string, unknown> = {
    code: errorCode,
    message,
    data: {},
    success: false,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  // optional dev logging
  if (config.env === 'development')
    // eslint-disable-next-line no-console
    console.error(err);

  res.status(statusCode).send(payload);
}
