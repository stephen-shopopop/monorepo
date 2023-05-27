import { logger } from '@stephen-shopopop/logger-poo'
import { Server } from 'http'
import sinon from 'sinon'
import { listenToErrorEvents } from '..'

afterEach(() => {
  sinon.restore()
})

describe('listenToErrorEvents', () => {
  test('When uncaughtException emitted then error handled and should log', () => {
    // Arrange
    const httpServerMock = sinon.createStubInstance(Server)
    const loggerStub = sinon.stub(logger, 'error')

    listenToErrorEvents(httpServerMock)

    const errorName = 'mocking an uncaught exception'
    const errorToEmit = new Error(errorName)

    // Act
    process.emit('uncaughtException', errorToEmit)

    // Assert
    expect(loggerStub.callCount).toBe(1)
    expect(loggerStub.firstCall.args).toMatchObject([
      {
        name: 'AppError',
        message: errorToEmit.message,
        HttpStatus: 500,
        isTrusted: true,
        stack: expect.any(String)
      }
    ])
  })

  test.skip('When SIGINT emitted then error handled and should log', () => {
    // Arrange
    const httpServerMock = sinon.createStubInstance(Server)

    listenToErrorEvents(httpServerMock)

    // Act
    process.kill(process.pid, 'SIGINT')

    // Assert
    expect(1).toBe(1)
  })

  test.skip('When SIGTERM emitted then error handled and should log', () => {
    // Arrange
    const httpServerMock = sinon.createStubInstance(Server)

    listenToErrorEvents(httpServerMock)

    // Act
    process.kill(process.pid, 'SIGINT')

    // Assert
    expect(1).toBe(1)
  })
})
