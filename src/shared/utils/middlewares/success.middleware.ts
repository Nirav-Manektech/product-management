import { Request, Response, NextFunction } from 'express';

export function successResponseMiddleware(_: Request, res: Response, next: NextFunction) {
  res.success = function (data: unknown, code: number, message: string) {
    return res.status(200).json({
      code,
      message,
      data,
      success: true,
    });
  };
  next();
}
