export class AppError extends Error {
  constructor (
    public override message: string,
    public HTTPStatus: number = 500,
    public isTrusted = true
  ) {
    super(message)

    Error.captureStackTrace(this, AppError)
    this.name = this.constructor.name
  }
}
