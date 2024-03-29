import sinon from 'sinon'
import { logger } from '../index'

beforeEach(() => {
  process.env['NODE_ENV'] = ''
  logger.resetLogger()
})

afterEach(() => {
  process.env['NODE_ENV'] = 'test'
  sinon.restore()
})

describe('logger', () => {
  test('When no explicit configuration is set, info logs are written', () => {
    // Arrange
    const stdoutStub = sinon.stub(process.stdout, 'write')

    // Act
    logger.info('I am a info')

    // Assert
    expect({ stdCallCount: stdoutStub.callCount }).toMatchObject({
      stdCallCount: 1
    })
    const lastStdoutCall = JSON.parse(stdoutStub.lastCall?.firstArg)
    expect(lastStdoutCall).toMatchObject({ msg: 'I am a info' })
  })

  test('When no explicit configuration is set, info logs with object are written', () => {
    // Arrange
    const stdoutStub = sinon.stub(process.stdout, 'write')

    // Act
    logger.info({ surname: 'rob' })

    // Assert
    expect({ stdCallCount: stdoutStub.callCount }).toMatchObject({
      stdCallCount: 1
    })
    const lastStdoutCall = JSON.parse(stdoutStub.lastCall?.firstArg)
    expect(lastStdoutCall).toMatchObject({ surname: 'rob' })
  })

  test('When log level is DEBUG and logger emits INFO statement, info logs are written', () => {
    // Arrange
    logger.configureLogger({ level: 'debug' }, true)
    const stdoutStub = sinon.stub(process.stdout, 'write')

    // Act
    logger.info('I am a info')

    // Assert
    expect({ stdCallCount: stdoutStub.callCount }).toMatchObject({
      stdCallCount: 1
    })
    const lastStdoutCall = JSON.parse(stdoutStub.lastCall?.firstArg)
    expect(lastStdoutCall).toMatchObject({ msg: 'I am a info' })
  })

  test('When logger is configured and then re-configured, then the new config applies', () => {
    // Arrange
    logger.configureLogger({ level: 'info' }, true)
    logger.configureLogger({ level: 'debug' }, true)
    const stdoutStub = sinon.stub(process.stdout, 'write')

    // Act
    logger.debug('I am a debug')

    // Assert
    expect({ stdCallCount: stdoutStub.callCount }).toMatchObject({
      stdCallCount: 1
    })
    const lastStdoutCall = JSON.parse(stdoutStub.lastCall?.firstArg)
    expect(lastStdoutCall).toMatchObject({ msg: 'I am a debug' })
  })

  test('When log level is ERROR and logger emits INFO statement, then nothing is written', () => {
    // Arrange
    logger.configureLogger({ level: 'error' }, true)
    const stdoutStub = sinon.stub(process.stdout, 'write')

    // Act
    logger.info('I am a info')

    // Assert
    expect(stdoutStub.callCount).toBe(0)
  })

  test('When configuring for pretty-print, then its written to stdout', () => {
    // Arrange
    logger.configureLogger({ level: 'info', prettyPrint: false }, true)
    const stdoutStub = sinon.stub(process.stdout, 'write')

    // Act
    logger.info('I am a info')

    // Assert
    expect({ stdCallCount: stdoutStub.callCount }).toMatchObject({
      stdCallCount: 1
    })
  })

  test('it should print the passed metadata', () => {
    // Arrange
    const stdoutStub = sinon.stub(process.stdout, 'write')
    logger.configureLogger({ level: 'info' }, true)
    const objectToPrint = { context: 'How are you' }

    // Act
    logger.info('I am a info', objectToPrint)

    // Assert
    expect(stdoutStub.callCount).toEqual(1)
    const lastStdoutCall = JSON.parse(stdoutStub.lastCall?.firstArg)
    expect(lastStdoutCall).toMatchObject({
      msg: 'I am a info',
      ...objectToPrint
    })
  })

  test('it should print the passed metadata with redact configuration', () => {
    // Arrange
    const stdoutStub = sinon.stub(process.stdout, 'write')
    logger.configureLogger({ level: 'info', redact: ['mysecret'] }, true)
    const objectToPrint = { context: 'How are you', mysecret: 'marc' }

    // Act
    logger.info('I am a info', objectToPrint)

    // Assert
    expect(stdoutStub.callCount).toEqual(1)
    const lastStdoutCall = JSON.parse(stdoutStub.lastCall?.firstArg)
    expect(lastStdoutCall).toMatchObject({
      msg: 'I am a info',
      ...objectToPrint,
      ...{ mysecret: '[Redacted]' }
    })
  })
})
