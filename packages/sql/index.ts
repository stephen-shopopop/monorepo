/**
 * SQL template query
 *
 * ```ts
 * sql`SELECT * FROM Users`
 * ```
 */
export const sql = (
  ...query: [TemplateStringsArray, ...Array<string | number | boolean | Date | bigint>]
): string => {
  const [template, ...args] = query

  return template.map(
    value => [value, (args.splice(0, 1))].join('')
  ).join('').replace(/\s+/g, ' ').trim()
}
