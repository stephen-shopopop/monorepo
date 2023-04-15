import { describe, expect, test } from '@jest/globals'
import { hello } from './index'

describe('[index/hello] hello()', () => {
  test('return "hello shopopop" when hello("you")', () => {
    expect(hello('you')).toEqual('hello you')
  })
})
