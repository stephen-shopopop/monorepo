export function isArray (value: unknown): boolean {
  return Array.isArray(value)
}

export function isBoolean (value: unknown): boolean {
  return typeof value === 'boolean' || value instanceof Boolean
}

export function isNull (value: unknown): boolean {
  return value === null
}

export function isNullOrUndefined (value: unknown): boolean {
  return value === null || value === undefined
}

export function isNumber (value: unknown): boolean {
  return typeof value === 'number' || value instanceof Number
}

export function isInteger (value: unknown): boolean {
  return Number(value) === value && value % 1 === 0
}

export function isString (value: unknown): boolean {
  return typeof value === 'string' || value instanceof String
}

export function isSymbol (value: unknown): boolean {
  return typeof value === 'symbol'
}

export function isUndefined (value: unknown): boolean {
  return value === undefined
}

export function isObject (value: unknown): boolean {
  return value !== null && typeof value === 'object'
}

export function isObjectPrototype (value: unknown): boolean {
  return (
    value !== null && typeof value === 'object' && Reflect.getPrototypeOf(value) === Object.prototype
  )
}

export function isError (e: unknown): boolean {
  return e instanceof Error
}

export function isFunction (value: unknown): boolean {
  return typeof value === 'function'
}

export function isRegExp (value: unknown): boolean {
  return value instanceof RegExp
}

export function isPrimitive (value: unknown): boolean {
  return (
    value === null || (typeof value !== 'object' && typeof value !== 'function')
  )
}

export function isBuffer (value: unknown): boolean {
  return Buffer.isBuffer(value)
}

export function isDate (value: unknown): boolean {
  return (
    value !== null && typeof value === 'object' && Object.prototype.toString.call(value) === '[object Date]'
  )
}

export function isMatch (value: string, regex: RegExp): boolean {
  return regex.test(value)
}

export function isAlpha (value: string): boolean {
  return isMatch(value, /^([a-z])+$/i)
}

export function isAlphaNum (value: string): boolean {
  return isMatch(value, /^[a-z0-9]+$/i)
}
