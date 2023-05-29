import { AppError } from '@stephen-shopopop/errorhandler'
import { context } from '@stephen-shopopop/request-context'
import type express from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import { JWTOptions } from '../definitions'

export const jwtVerifierExpressMiddleware = (
  options: JWTOptions
): (req: express.Request, res: express.Response, next: express.NextFunction) => void => {
  return function middleware (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ): void {
    const authenticationHeader = req.headers.authorization ?? req.headers['Authorization']

    if (authenticationHeader === undefined || Array.isArray(authenticationHeader)) {
      const error = new AppError('JWT - missing header authorization', 401)
      next(error)
      return
    }

    let token: string

    // A token comes in one of two forms: 'token' or 'Bearer token'
    const authHeaderParts = authenticationHeader.split(' ')

    if (authHeaderParts.length > 2) {
      const error = new AppError('JWT - the incoming token has unknown structure', 401)
      next(error)
      return
    }

    if (authHeaderParts.length === 2) {
      [, token = ''] = authHeaderParts
    } else {
      token = authenticationHeader
    }

    jwt.verify(
      token,
      options.secret,
      (err: VerifyErrors | null, jwtContent: any) => {
        if (err != null) {
          const error = new AppError('JWT - invalid or expired token', 401, true, err)
          next(error)
          return
        }

        // Add user on context
        // TODO add zod to validate user structure
        context.set('user', jwtContent.data)

        next()
      }
    )
  }
}
