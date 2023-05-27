import { HTTPStatus, httpStatusCode } from '@stephen-shopopop/http-status'
import type express from 'express'
import { AppError } from '../../appError'
import { handleError } from '../../errorHandler'

function definedErrorNotFoundExpressMiddleware (
  _req: express.Request,
  _res: express.Response,
  next: express.NextFunction
): void {
  const err = new AppError(httpStatusCode(HTTPStatus.NotFound), HTTPStatus.NotFound)

  next(err)
}

function defineErrorHandlingExpressMiddleware (
  error: unknown,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
): void {
  // ✅ Pass all error to a centralized error handler so they get treated equally
  handleError(error)

  if (error instanceof AppError) {
    res
      .status(error.HttpStatus)
      .json({
        error: {
          code: error.HttpStatus,
          message: httpStatusCode(error.HttpStatus),
          details: { ...error.cause }
        }
      }).end()
  } else {
    res
      .status(HTTPStatus.InternalServerError)
      .json({
        error: {
          code: HTTPStatus.InternalServerError,
          message: httpStatusCode(HTTPStatus.InternalServerError)
        }
      }).end()
  }
}

/**
 * This is an express middleware
 */
export function defineErrorStyleExpressMiddleware (expressApp: express.Application): void {
  expressApp.use(definedErrorNotFoundExpressMiddleware)
  expressApp.use(defineErrorHandlingExpressMiddleware)
}
