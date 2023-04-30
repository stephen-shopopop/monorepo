import { Logger, LoggerConfiguration } from './definitions'
import pinoLogger, { PinoLogger } from './pino.logger'

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
    debug: (message: string | object, metadata?: object) => {
      if (typeof message === 'object') {
        _getInitializeLogger().debug({ metadata: message })
      } else {
        _getInitializeLogger().debug({ message, metadata })
      }
    },
    error: (message: string | object, metadata?: object) => {
      if (typeof message === 'object') {
        _getInitializeLogger().error({ metadata: message })
      } else {
        _getInitializeLogger().error({ message, metadata })
      }
    },
    fatal: (message: string | object, metadata?: object) => {
      if (typeof message === 'object') {
        _getInitializeLogger().fatal({ metadata: message })
      } else {
        _getInitializeLogger().fatal({ message, metadata })
      }
    },
    info: (message: string | object, metadata?: object) => {
      if (typeof message === 'object') {
        _getInitializeLogger().info({ metadata: message })
      } else {
        _getInitializeLogger().info({ message, metadata })
      }
    },
    warn: (message: string | object, metadata?: object) => {
      if (typeof message === 'object') {
        _getInitializeLogger().warn({ metadata: message })
      } else {
        _getInitializeLogger().warn({ message, metadata })
      }
    },
    resetLogger: () => {
      underlyingLogger = null
    }
  }
}

export const logger = loggerWrapper()
