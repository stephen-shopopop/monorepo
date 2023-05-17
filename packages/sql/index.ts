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
    value => [value, (args.splice(0, 1))].join('')
  ).join('').replace(/\s+/g, ' ').trim()
}
