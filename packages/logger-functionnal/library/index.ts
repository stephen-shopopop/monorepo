import { Logger, LoggerConfiguration } from './definitions'
import pinoLogger, { PinoLogger, PinoLoggerProps } from './pino.logger'

const handleLogger = (message: string | object, metadata?: object): PinoLoggerProps => {
  if (typeof message === 'object') {
    return { metadata: message }
  } else {
    return { metadata, message }
  }
}

export const loggerWrapper = (): Logger => {
  let underlyingLogger: PinoLogger | null = null

  const _getInitializeLogger = (): PinoLogger => {
    _configureLogger({}, false)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return underlyingLogger!
  }

  const _configureLogger = (configuration: Partial<LoggerConfiguration>, overrideIfExists = true): void => {
    if (underlyingLogger === null || overrideIfExists) {
      underlyingLogger = pinoLogger({
        enabled: process.env['NODE_ENV'] !== 'test',
        label: configuration.label,
        level: configuration.level ?? 'info',
        prettyPrint: configuration.prettyPrint ?? false,
        redact: configuration.redact
      })
    }
  }

  return {
    configureLogger: (configuration: Partial<LoggerConfiguration>, overrideIfExists = true) => {
      _configureLogger(configuration, overrideIfExists)
    },
    debug: (message: string | object, metadata?: object) =>
      _getInitializeLogger().debug(handleLogger(message, metadata)),
    error: (message: string | object, metadata?: object) =>
      _getInitializeLogger().error(handleLogger(message, metadata)),
    fatal: (message: string | object, metadata?: object) =>
      _getInitializeLogger().fatal(handleLogger(message, metadata)),
    info: (message: string | object, metadata?: object) =>
      _getInitializeLogger().info(handleLogger(message, metadata)),
    warn: (message: string | object, metadata?: object) =>
      _getInitializeLogger().warn(handleLogger(message, metadata)),
    resetLogger: () => {
      underlyingLogger = null
    }
  }
}

export const logger = loggerWrapper()
