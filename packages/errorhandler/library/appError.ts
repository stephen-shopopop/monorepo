import { context } from '@stephen-shopopop/request-context'

export class AppError extends Error {
  readonly context: Record<PropertyKey, unknown> | undefined

  constructor (
    public override message: string,
    public HTTPStatus: number = 500,
    public isTrusted = true,
    public override cause?: unknown
  ) {
    super(message, { cause })

    Error.captureStackTrace(this, AppError)

    this.name = this.constructor.name
    this.context = context.getStore()
  }
}
