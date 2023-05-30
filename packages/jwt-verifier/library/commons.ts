import { z } from '@stephen-shopopop/validation'
import { AppError } from 'packages/errorhandler'

export const claimsUserSchema = z.object({
  email: z.string().email(),
  email_verified: z.boolean(),
  name: z.string().length(255),
  sub: z.string().uuid().or(z.number().positive().gt(0))
})

export const userClaimsJwtverfier = (claimsData: unknown): z.infer<typeof claimsUserSchema> => {
  const claimsVerifier = claimsUserSchema.safeParse(claimsData)

  if (!claimsVerifier.success) {
    throw new AppError('JWT claims - invalid user claims structure', 403, true, claimsVerifier.error)
  }

  return claimsVerifier.data
}
