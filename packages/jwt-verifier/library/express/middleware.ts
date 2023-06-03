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
      handleError(
        new AppError('JWT - missing header authorization', HTTPStatus.Unauthorized)
      )

      res
        .status(HTTPStatus.Unauthorized)
        .json(errorStyleHttpResponse(HTTPStatus.Unauthorized))
        .end()

      return
    }

    let token: string

    // A token comes in one of two forms: 'token' or 'Bearer token'
    const authHeaderParts = authenticationHeader.trim().split(' ')

    if (authHeaderParts.length > 2) {
      handleError(
        new AppError('JWT - the incoming token has unknown structure', HTTPStatus.Unauthorized)
      )

      res
        .status(HTTPStatus.Unauthorized)
        .json(errorStyleHttpResponse(HTTPStatus.Unauthorized))
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
          handleError(
            new AppError('JWT - verifier', HTTPStatus.Unauthorized, true, err)
          )

          res
            .status(HTTPStatus.Unauthorized)
            .json(errorStyleHttpResponse(HTTPStatus.Unauthorized))
            .end()

          return
        }

        try {
          const jwtClaims = userClaimsJwtVerifier(jwtContent.data)

          // Add user on request context
          context.set('user', jwtClaims)
        } catch (error) {
          handleError(error)

          res
            .status(HTTPStatus.Forbidden)
            .json(errorStyleHttpResponse(HTTPStatus.Forbidden))
            .end()

          return
        }

        next()
      }
    )
  }
}
