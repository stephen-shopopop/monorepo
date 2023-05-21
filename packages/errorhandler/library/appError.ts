import { context } from '@stephen-shopopop/request-context'
import { HTTPStatus } from '@stephen-shopopop/http-status'

export class AppError extends Error {
  readonly context: Record<PropertyKey, unknown> | undefined

  constructor (
    public override message: string,
    public HttpStatus: number = HTTPStatus.InternalServerError,
    public isTrusted = true,
    public override cause?: unknown
  ) {
    super(message, { cause })

    Error.captureStackTrace(this, AppError)

    this.name = this.constructor.name
    this.context = context.getStore()
  }
}
