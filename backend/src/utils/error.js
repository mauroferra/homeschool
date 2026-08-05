export class AppError extends Error {
  constructor(statusCode, message, code = 'APP_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const notFound = (msg = 'Resource not found') => new AppError(404, msg, 'NOT_FOUND');
export const badRequest = (msg = 'Bad request', code = 'BAD_REQUEST') => new AppError(400, msg, code);
export const forbidden = (msg = 'Forbidden', code = 'FORBIDDEN') => new AppError(403, msg, code);
export const unauthorized = (msg = 'Unauthorized', code = 'UNAUTHORIZED') => new AppError(401, msg, code);