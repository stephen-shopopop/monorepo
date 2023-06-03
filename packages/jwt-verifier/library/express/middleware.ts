import { AppError, handleError } from '@stephen-shopopop/errorhandler'
import { HTTPStatus } from '@stephen-shopopop/http-status'
import { context } from '@stephen-shopopop/request-context'
import type express from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import { errorStyleHttpResponse, userClaimsJwtVerifier } from '../commons'
import { JWTOptions } from '../definitions'

/**
 * This is an express middleware
 */
export const jwtVerifierExpressMiddleware = (
  options: JWTOptions
): (req: express.Request, res: express.Response, next: express.NextFunction) => void => {
  return function jwtMiddleware (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): any {
    const authenticationHeader = req.headers.authorization ?? req.headers['Authorization']

    if (authenticationHeader === undefined || Array.isArray(authenticationHeader)) {
      const error = new AppError('JWT - missing header authorization', HTTPStatus.Unauthorized)
      handleError(error)

      res
        .status(error.HttpStatus)
        .json(errorStyleHttpResponse(error.HttpStatus))
        .end()

      return
    }

    let token: string

    // A token comes in one of two forms: 'token' or 'Bearer token'
    const authHeaderParts = authenticationHeader.trim().split(' ')

    if (authHeaderParts.length > 2) {
      const error = new AppError('JWT - the incoming token has unknown structure', HTTPStatus.Unauthorized)
      handleError(error)

      res
        .status(error.HttpStatus)
        .json(errorStyleHttpResponse(error.HttpStatus))
        .end()

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
        if (err !== null) {
          const error = new AppError('JWT - verifier', HTTPStatus.Unauthorized, true, err)
          handleError(error)

          res
            .status(error.HttpStatus)
            .json(errorStyleHttpResponse(error.HttpStatus))
            .end()

          return
        }

        try {
          const jwtClaims = userClaimsJwtVerifier(jwtContent.data)

          // Add user on request context
          context.set('user', jwtClaims)

          // Add user on request express
          // @ts-expect-error
          req.user = jwtClaims
        } catch (error) {
          handleError(error)

          res
            .status((error as AppError).HttpStatus)
            .json(errorStyleHttpResponse((error as AppError).HttpStatus))
            .end()

          return
        }

        next()
      }
    )
  }
}
