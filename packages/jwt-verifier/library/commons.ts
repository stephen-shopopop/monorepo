import { AppError } from '@stephen-shopopop/errorhandler'
import { HTTPStatus, httpStatusCode } from '@stephen-shopopop/http-status'
import { z } from '@stephen-shopopop/validation'

export const claimsUserSchema = z.object({
  email: z.string().email(),
  email_verified: z.boolean(),
  name: z.string().max(255),
  sub: z.string().uuid().or(z.number().positive().gt(0))
})

export const userClaimsJwtVerifier = (claimsData: unknown): z.infer<typeof claimsUserSchema> => {
  const claimsVerifier = claimsUserSchema.safeParse(claimsData)

  if (!claimsVerifier.success) {
    throw new AppError('JWT claims - invalid user claims structure', HTTPStatus.Forbidden, true, claimsVerifier.error)
  }

  return claimsVerifier.data
}

export const errorStyleHttpResponse = (httpStatus: HTTPStatus): Record<string, unknown> => {
  return {
    error: {
      code: httpStatus,
      details: {},
      message: httpStatusCode(httpStatus)
    }
  }
}
