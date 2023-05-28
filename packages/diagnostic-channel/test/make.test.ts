import { describe, expect, test } from '@jest/globals'
import { make } from '../library/channel'

describe('[diagnostic-channel] make()', () => {
  test('When publish "hello" then return event with data "hello', () => {
    // Arrange
    let listener: string | undefined

    const diagnosticChannel = make<string>()
    const data = 'hello'

    diagnosticChannel.subcribe('test', (event) => { listener = event.data })

    // Act
    diagnosticChannel.publish('test', data)

    // Assert
    expect(listener).toBe(data)
  })

  test('When publish "hello" on multiple subecribe then return event with data "hello"', () => {
    // Arrange
    let firstlistener: string | undefined
    let secondlistener: string | undefined

    const diagnosticChannel = make<string>()
    const data = 'hello'

    diagnosticChannel.subcribe('test', (event) => { firstlistener = event.data })
    diagnosticChannel.subcribe('test', (event) => { secondlistener = event.data })

    // Act
    diagnosticChannel.publish('test', data)

    // Assert
    expect(firstlistener).toBe(data)
    expect(secondlistener).toBe(data)
  })

  test('When publish "hello" on make with limit 1 then return one subscribe event with data "hello"', () => {
    // Arrange
    let firstlistener: string | undefined
    let secondlistener: string | undefined

    const diagnosticChannel = make<string>(1)
    const data = 'hello'

    diagnosticChannel.subcribe('test', (event) => { firstlistener = event.data })
    diagnosticChannel.subcribe('test', (event) => { secondlistener = event.data })

    // Act
    diagnosticChannel.publish('test', data)

    // Assert
    expect(firstlistener).toBe(data)
    expect(secondlistener).toBe(undefined)
  })

  test('When publish "hello" and unscribe this topic then return nothing subcribe call', () => {
    // Arrange
    let listener: unknown

    const diagnosticChannel = make(1)
    const data = 'hello'

    diagnosticChannel.subcribe('test', (event) => { listener = event.data })
    diagnosticChannel.unsubcribe('test')

    // Act
    diagnosticChannel.publish('test', data)

    // Assert
    expect(listener).toBe(undefined)
  })

  test('When publish "hello" and subscribe throw an error then return nothing for this subcribe call', () => {
    // Arrange
    let listener: unknown

    const diagnosticChannel = make(1)
    const data = 'hello'

    diagnosticChannel.subcribe('test', () => { throw new Error('Error') })
    diagnosticChannel.unsubcribe('test')

    // Act
    diagnosticChannel.publish('test', data)

    // Assert
    expect(listener).toBe(undefined)
  })
})
