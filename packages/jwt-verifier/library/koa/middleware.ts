import { AppError, handleError } from '@stephen-shopopop/errorhandler'
import { HTTPStatus } from '@stephen-shopopop/http-status'
import { context } from '@stephen-shopopop/request-context'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import type { Context, Next } from 'koa'
import { errorStyleHttpResponse, userClaimsJwtVerifier } from '../commons'
import { JWTOptions } from '../definitions'

enum KoaError {
  ForbiddenError = 'ForbiddenError',
  UnauthorizedError = 'UnauthorizedError'
}

/**
 * This is an koa middleware
 */
export const jwtVerifierKoaMiddleware = (
  options: JWTOptions
): (ctx: Context, next: Next) => Promise<void> => {
  return async function jwtMiddleware (ctx: Context, next: Next): Promise<void> {
    try {
      const authenticationHeader = ctx.request.get('authorization')

      if (authenticationHeader === '') {
        const error = new AppError('JWT - missing header authorization', HTTPStatus.Unauthorized)
        handleError(error)

        ctx.throw(error.HttpStatus)
      }

      let token: string

      // A token comes in one of two forms: 'token' or 'Bearer token'
      const authHeaderParts = authenticationHeader.trim().split(' ')

      if (authHeaderParts.length > 2) {
        const error = new AppError('JWT - the incoming token has unknown structure', HTTPStatus.Unauthorized)
        handleError(error)

        ctx.throw(error.HttpStatus)
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
          if (err !== null) {
            const error = new AppError('JWT - verifier', HTTPStatus.Unauthorized, true, err)
            handleError(error)

            ctx.throw(error.HttpStatus)
          }

          try {
            const jwtClaims = userClaimsJwtVerifier(jwtContent.data)

            // Add user on context
            context.set('user', jwtClaims)

            // Add user on koa context state
            ctx.state['user'] = jwtClaims
          } catch (error) {
            handleError(error)

            ctx.throw((error as AppError).HttpStatus)
          }
        }
      )

      await next()
    } catch (error) {
      if (error instanceof Error && error.name in KoaError) {
        const status = error.name === KoaError.ForbiddenError
          ? HTTPStatus.Forbidden
          : HTTPStatus.Unauthorized

        ctx.body = errorStyleHttpResponse(status)
        ctx.status = status
      }
    }
  }
}
