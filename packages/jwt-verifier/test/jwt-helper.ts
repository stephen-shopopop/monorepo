import jwt from 'jsonwebtoken'

export function signInvalidToken (): string {
  return signTokenSynchronously({ user: 'joe' }, Date.now() + 60 * 60)
}

export function signExpiredToken (): string {
  return signTokenSynchronously({
    email: 'me@email.com',
    email_verified: false,
    name: 'John',
    sub: 1
  }, 0)
}

export function signTokenSynchronously (
  user: Record<string, unknown>,
  expirationInUnixTime: number
): string {
  const token = jwt.sign(
    {
      exp: expirationInUnixTime,
      data: user
    },
    exampleSecret
  )

  return token
}

export const exampleSecret = 'my-secret'
