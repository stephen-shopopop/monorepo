import { AppError } from '@stephen-shopopop/errorhandler'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import type { Context, Next } from 'koa'
import { context } from 'packages/request-context'
import { userClaimsJwtVerifier } from '../commons'
import { JWTOptions } from '../definitions'

/**
 * This is an koa middleware
 */
export const jwtVerifierExpressMiddleware = async (
  options: JWTOptions
): Promise<(ctx: Context, next: Next) => Promise<void>> => {
  return async function jwtMiddleware (ctx: Context, next: Next): Promise<void> {
    const authenticationHeader = ctx.request.get('authorization')

    if (authenticationHeader === '') {
      throw new AppError('JWT - missing header authorization', 401)
    }

    let token: string

    // A token comes in one of two forms: 'token' or 'Bearer token'
    const authHeaderParts = authenticationHeader.trim().split(' ')

    if (authHeaderParts.length > 2) {
      throw new AppError('JWT - the incoming token has unknown structure', 401)
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
          throw new AppError('JWT - verify error', 401, true, err)
        }

        const jwtClaims = userClaimsJwtVerifier(jwtContent.data)

        // Add user on context
        context.set('user', jwtClaims)
      }
    )

    await next()
  }
}
