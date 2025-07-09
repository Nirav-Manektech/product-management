import { IUserDoc } from '@/modules/user/user.interfaces';

declare module 'express-serve-static-core' {
  export interface Request {
    user: IUserDoc;
  }

  interface Response {
    success: (data: unknown, code: number, message: string) => Response;
  }
}
