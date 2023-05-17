import assert from 'node:assert'

/**
 * SQL template query
 *
 * ```ts
 * sql`SELECT * FROM Users`
 * ```
 */
export function sql (...args: unknown[]): string {
  const [template, ...rest] = args

  assert(Array.isArray(template), 'Bad value format')

  return template.map(
    (value: unknown) => {
      const result = [
        typeof value === 'string' ? value.replace(/\s+/g, ' ') : value,
        rest[0]
      ].join('')

      rest.splice(0, 1)

      return result
    }
  ).join('').trim()
}
