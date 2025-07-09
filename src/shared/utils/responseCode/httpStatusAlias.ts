import httpStatus, { HttpStatus } from 'http-status';

// Safe fallback for CommonJS and ESM compatibility
const defaultStatus: HttpStatus = httpStatus;
const status = 'status' in httpStatus ? httpStatus.status : {};

export { defaultStatus, status };
