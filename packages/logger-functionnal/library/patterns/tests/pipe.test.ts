import { describe, expect, test } from '@jest/globals'
import { pipe } from '../pipe'

function isFunction (value: unknown): boolean {
  return typeof value === 'function'
}

describe('[pattern/pipe] pipe', () => {
  test('When pipe then return function', () => {
    const sanitizeWord = pipe(
      (word: string) => word.trim(),
      (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
    )

    expect(isFunction(sanitizeWord)).toBeTruthy()
  })

  test('When async pipe then return function', () => {
    const sanitizeWord = pipe(
      (word: string) => word.trim(),
      (word: string) => word.charAt(0).toUpperCase() + word.slice(1),
      async (word: string) => (await word) + 't',
      async (word: string) => await Promise.resolve(word + 's')
    )

    expect(isFunction(sanitizeWord)).toBeTruthy()
  })

  test('When curring pipe with type string then return type string', () => {
    const word = pipe(
      (word: string) => word.trim(),
      (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
    )(' lorem')

    expect(word).toEqual('Lorem')
  })

  test('When curring pipe with type array then return type array', () => {
    const words = pipe(
      (words: string[]) => words.map((word: string) => word.trim()),
      (words: string[]) => words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    )([' Lorem', 'ipsum'])

    expect(words).toEqual(['Lorem', 'Ipsum'])
  })

  test('When curring async pipe with type string then return type string', async () => {
    const word = await pipe(
      (word: string) => word.trim(),
      (word: string) => word.charAt(0).toUpperCase() + word.slice(1),
      async (word: string) => await Promise.resolve(word + 's')
    )(' lorem')

    expect(word).toEqual('Lorems')
  })
})
