import { describe, expect, test } from '@jest/globals'
import {
  isArray,
  isBoolean,
  isNull,
  isNullOrUndefined,
  isNumber,
  isString,
  isSymbol,
  isUndefined,
  isObject,
  isObjectPrototype,
  isError,
  isFunction,
  isRegExp,
  isPrimitive,
  isBuffer,
  isDate,
  isMatch,
  isAlpha,
  isAlphaNum,
  isInteger
} from '../index'

describe('[utils] isArray', () => {
  test('has Array', () => expect(isArray([])).toBeTruthy())
  test('Object is not Array', () => expect(isArray({ a: 1, b: 2 })).toBeFalsy())
  test('Null is not Array', () => expect(isArray(null)).toBeFalsy())
})

describe('[utils] isBoolean', () => {
  test('has Boolean', () => expect(isBoolean(true)).toBeTruthy())
  test('has Boolean', () => expect(isBoolean(false)).toBeTruthy())
  test('String is not Boolean', () => expect(isBoolean('true')).toBeFalsy())
})

describe('[utils] isNull', () => {
  test('has Null', () => expect(isNull(null)).toBeTruthy())
  test('Undefined is not Null', () => expect(isNull(undefined)).toBeFalsy())
  test('0 is not Null', () => expect(isNull(0)).toBeFalsy())
  test('Empty String is not Null', () => expect(isNull('')).toBeFalsy())
})

describe('[utils] isNullOrUndefined', () => {
  test('has NullOrUndefined', () => expect(isNullOrUndefined(null)).toBeTruthy())
  test('has NullOrUndefined', () => expect(isNullOrUndefined(undefined)).toBeTruthy())
  test('Empty String is not NullOrUndefined', () => expect(isNullOrUndefined('')).toBeFalsy())
})

describe('[utils] isNumber', () => {
  test('has Number', () => expect(isNumber(4)).toBeTruthy())
  test('String number is not Number', () => expect(isNumber('4')).toBeFalsy())
})

describe('[utils] isString', () => {
  test('has String', () => expect(isString('shopopop')).toBeTruthy())
  test('Number is not String', () => expect(isString(3306)).toBeFalsy())
})

describe('[utils] isSymbol', () => {
  test('has Symbol', () => expect(isSymbol(Symbol('test'))).toBeTruthy())
  test('String is not Symbol', () => expect(isSymbol('string')).toBeFalsy())
})

describe('[utils] isUndefined', () => {
  test('has Undefined', () => {
    let t
    expect(isUndefined(t)).toBeTruthy()
  })
  test('String is not Undefined', () => expect(isUndefined('undefined')).toBeFalsy())
  test('Object is not Undefined', () => expect(isUndefined({})).toBeFalsy())
})

describe('[utils] isObject', () => {
  test('has Object', () => expect(isObject({ a: 4 })).toBeTruthy())
  test('has Object', () => expect(isObject({})).toBeTruthy())
  test('has Object', () => expect(isObject([1, 2])).toBeTruthy())
  test('has Object', () => expect(isObject(new Map([['a', 4]]))).toBeTruthy())
  test('has Object', () => expect(isObject(new Set(['a', 4]))).toBeTruthy())
  test('String is not Object', () => expect(isObject('shopopop')).toBeFalsy())
})

describe('[utils] isObjectPrototype', () => {
  test('has ObjectPrototype', () => expect(isObjectPrototype({ a: 4 })).toBeTruthy())
  test('has ObjectPrototype', () => expect(isObjectPrototype({})).toBeTruthy())
  test('Array is not ObjectPrototype', () => expect(isObjectPrototype(['44'])).toBeFalsy())
  test('Map is not ObjectPrototype', () => expect(isObjectPrototype(new Map([['a', 4]]))).toBeFalsy())
  test('Set is not ObjectPrototype', () => expect(isObjectPrototype(new Set(['a', 4]))).toBeFalsy())
})

describe('[utils] isError', () => {
  test('has Error', () => {
    const a = new Error()
    expect(isError(a)).toBeTruthy()
  })
  test('has Error', () => {
    const b = new TypeError()
    expect(isError(b)).toBeTruthy()
  })
  test('has Error', () => {
    const c = new RangeError()
    expect(isError(c)).toBeTruthy()
  })
  test('String is not Error', () => expect(isError('error')).toBeFalsy())
})

describe('[utils] IsFunction', () => {
  test('has Function', () => {
    const a = function (): void {}
    expect(isFunction(a)).toBeTruthy()
  })
  test('Object is not ObjectPrototype', () => expect(isFunction({})).toBe(false))
})

describe('[utils] isRegExp', () => {
  test('has RegExp', () => expect(isRegExp(/ba/)).toBeTruthy())
  test('Null is not RegExp', () => expect(isRegExp(null)).toBeFalsy())
  test('Undefined is not RegExp', () => expect(isRegExp(undefined)).toBeFalsy())
})

describe('[utils] isPrimitive', () => {
  test('has Primitive', () => expect(isPrimitive(4)).toBeTruthy())
  test('has Primitive', () => expect(isPrimitive('shopopop')).toBeTruthy())
  test('has Primitive', () => expect(isPrimitive('true')).toBeTruthy())
  test('has Primitive', () => expect(isPrimitive(Symbol('test'))).toBeTruthy())
  test('has Primitive', () => expect(isPrimitive(null)).toBeTruthy())
  test('has Primitive', () => expect(isPrimitive(undefined)).toBeTruthy())
  test('Array is not Primitive', () => expect(isPrimitive([4, 5])).toBeFalsy())
  test('Object is not Primitive', () => expect(isPrimitive({ a: 4 })).toBeFalsy())
})

describe('[utils] isBuffer', () => {
  test('has Buffer', () => expect(isBuffer(Buffer.from('shopopop'))).toBeTruthy())
  test('String is not buffer', () => expect(isBuffer('shopopop')).toBeFalsy())
})

describe('[utils] isDate', () => {
  test('has Date', () => expect(isDate(new Date())).toBeTruthy())
  test('String is not Date', () => expect(isDate('2020-10-04T10:00:00.000Z')).toBeFalsy())
})

describe('[utils] isMatch', () => {
  test('has Match', () => expect(isMatch('a', /^([a-z])+$/i)).toBeTruthy())
  test('is not Match', () => expect(isMatch('5', /^([a-z])+$/i)).toBeFalsy())
})

describe('[utils] isAlpha', () => {
  test('"baBA" has Alpha', () => expect(isAlpha('baBA')).toBeTruthy())
  test('"151A" is not Alpha', () => expect(isAlpha('151A')).toBeFalsy())
})

describe('[utils] isAlphaNum', () => {
  test('"151A" has AlphaNum', () => expect(isAlphaNum('151A')).toBeTruthy())
  test('"151A@" is not AlphaNum', () => expect(isAlphaNum('151A@')).toBeFalsy())
})

describe('[utils] isInteger', () => {
  test('1 has Integer', () => expect(isInteger(1)).toBeTruthy())
  test('"1" is not Integer', () => expect(isInteger('1')).toBeFalsy())
  test('0.1 is not Integer', () => expect(isInteger(0.1)).toBeFalsy())
})
