import { HTTPStatus, httpStatusCode } from '@stephen-shopopop/http-status'
import type { Context, Next } from 'koa'
import { AppError } from '../../appError'

/**
 * This is an koa middleware
 */
export async function defineErrorHandlingKoaMiddleware (
  ctx: Context,
  next: Next
): Promise<void> {
  try {
    await next()
  } catch (error) {
    if (error instanceof AppError) {
      ctx.response.status = error.HttpStatus
      ctx.response.body = {
        error: {
          code: error.HttpStatus,
          message: httpStatusCode(error.HttpStatus),
          details: { ...error.cause }
        }
      }
    } else {
      ctx.response.status = HTTPStatus.InternalServerError
      ctx.response.body = {
        error: {
          code: HTTPStatus.InternalServerError,
          message: httpStatusCode(HTTPStatus.InternalServerError)
        }
      }
    }
  }
}
