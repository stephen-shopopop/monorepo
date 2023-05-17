import assert from 'node:assert'

/**
 * SQL template query
 *
 * ```ts
 * sql`SELECT * FROM Users`
 * ```
 */
export const sql = (...query: Array<string | number | boolean | bigint | object>): string => {
  const [template, ...args] = query

  assert(Array.isArray(template), 'Bad template format - use tagged templating')

  return template.map(
    (value: unknown) => {
      const arg = args.splice(0, 1)

      return [
        typeof value === 'string' ? value.replace(/\s+/g, ' ') : value,
        arg
      ].join('')
    }
  ).join('').trim()
}
