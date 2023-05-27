import { logger } from '@stephen-shopopop/logger-poo'
import sinon from 'sinon'
import { AppError, handleError } from '..'

beforeEach(() => {
  // Active logger to process.stdout
  process.env['NODE_ENV'] = ''
})

afterEach(() => {
  // Clean
  process.env['NODE_ENV'] = 'test'
  sinon.restore()
})

describe('handleError', () => {
  test('When handling an Error instance then should log', () => {
    // Arrange
    const errorToHandle = new Error('i am an error')
    const stdoutStub = sinon.stub(process.stdout, 'write')

    // Act
    handleError(errorToHandle)

    // Assert
    expect(stdoutStub.callCount).toBe(1)
  })

  test('When handling AppError then all properties are passed to the logger', () => {
    // Arrange
    const errorToHandle = new AppError(
      'bad request',
      400,
      true
    )
    const loggerListener = sinon.stub(logger, 'error')

    // Act
    handleError(errorToHandle)

    // Assert
    expect(loggerListener.callCount).toBe(1)
    expect(loggerListener.lastCall.args).toMatchObject([
      {
        name: 'AppError',
        HttpStatus: 400,
        message: 'bad request',
        isTrusted: true,
        stack: expect.any(String)
      }
    ])
  })

  test.each([
    1,
    'oops!',
    null,
    Infinity,
    false,
    { key: 'value' },
    [],
    undefined,
    NaN,
    '🐥',
    () => { /** */ }
  ])(
    'When handling an Error instance then should log an AppError instance after receiving unknown error',
    (unknownErrorValue) => {
      // Arrange
      const loggerStub = sinon.stub(logger, 'error')

      // Act
      handleError(unknownErrorValue)

      // Assert
      const message = loggerStub.firstCall.args[0].toString()

      expect(loggerStub.callCount).toBe(1)
      expect(message.includes(typeof unknownErrorValue)).toBe(true)
      expect(loggerStub.firstCall.args).toMatchObject([
        {
          name: 'AppError',
          HttpStatus: 500,
          isTrusted: true,
          stack: expect.any(String)
        }
      ])
    }
  )
})
