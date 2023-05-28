import { describe, expect, test } from '@jest/globals'
import { diagnosticsChannel } from '../library/diagnostic-channel'

describe('[diagnostic-channel] diagnosticsChannel()', () => {
  test('When publish "hello" then return event with data "hello', () => {
    // Arrange
    let listener: unknown
    let channelName: string | Symbol | undefined

    const data = 'hello'

    function onMessage (message: unknown, name: string | symbol): void {
      try {
        listener = message
        channelName = name
      } catch { /** */ }
    }

    diagnosticsChannel.subscribe(onMessage)

    // Act
    diagnosticsChannel.publish(data)

    // Assert
    expect(diagnosticsChannel.hasSubscribers).toBe(true)
    expect(listener).toBe(data)
    expect(channelName).toBe('app-diagnostics')
  })

  test.only('When publish "hello" and unsubscribe channel then return event with data "hello', () => {
    // Arrange
    let listener: unknown
    let channelName: string | Symbol | undefined

    const data = 'hello'

    function onMessage (message: unknown, name: string | symbol): void {
      try {
        listener = message
        channelName = name
      } catch { /** */ }
    }

    diagnosticsChannel.subscribe(onMessage)
    diagnosticsChannel.unsubscribe(onMessage)

    // Act
    diagnosticsChannel.publish(data)

    // Assert
    expect(listener).toBe(undefined)
    expect(channelName).toBe(undefined)
  })
})
