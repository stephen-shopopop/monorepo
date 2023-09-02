import { describe, expect, test } from '@jest/globals'
import { match, when } from '../match'

function isFunction (value: unknown): boolean {
  return typeof value === 'function'
}

describe('[pattern/matching] when', () => {
  test('When curring "when" with predicate & execution then return pattern', () => {
    const condition = when((name: string) => typeof name === 'string')
    const pattern = condition((name: string) => name)

    expect(isFunction(condition)).toBeTruthy()
    expect(isFunction(pattern.predicate)).toBeTruthy()
    expect(isFunction(pattern.execution)).toBeTruthy()
  })
})

describe('[pattern/matching] match', () => {
  test('When curring match whitout pattern & default execution then return error', () => {
    try {
      match('test')(
        when((name: string) => typeof name === 'number')((name: string) => name.toLocaleUpperCase)
      )()
    } catch (error) {
      expect(error instanceof Error).toBeTruthy()
      expect(String(error)).toEqual('Error: Error: no pattern matched. Please use a wildcard pattern.')
    }
  })

  test('When curring match with string type then return array', () => {
    const result = match('lorem')(
      when((word: string) => word.length === 0)((word: string) => [word])
    )((word: string) => [word, 'latium'])

    expect(result).toEqual(['lorem', 'latium'])
  })

  test('When curring match with event return undefined then return undefined', () => {
    const word = match('lorem')(
      when((user: string) => user.length > 0)((user: string) => { user = user + 'ipsum' })
    )()

    expect(word).toEqual(undefined)
  })

  test('When async curring match with execution return promise then return value', async () => {
    const predicate = (word: string): boolean => word.length > 0
    const execution = async (word: string): Promise<string> => await Promise.resolve(String([word, 'ipsum']))

    const word = await match('lorem')(
      when(predicate)(execution)
    )()

    expect(String(word)).toEqual('lorem,ipsum')
  })
})
