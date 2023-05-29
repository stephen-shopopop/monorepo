import jwt from 'jsonwebtoken'

export function signValidToken (): string {
  return signTokenSynchronously('joe', ['admin'], Date.now() + 60 * 60)
}

export function signExpiredToken (): string {
  return signTokenSynchronously('joe', ['admin'], 0)
}

export function signTokenSynchronously (
  user: string,
  roles: string[],
  expirationInUnixTime: number
): string {
  const token = jwt.sign(
    {
      exp: expirationInUnixTime,
      data: {
        user,
        roles
      }
    },
    exampleSecret
  )

  return token
}

export const exampleSecret = 'my-secret'
