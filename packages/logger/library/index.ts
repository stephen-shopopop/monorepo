import { context } from '@stephen-shopopop/request-context'
import PinoLogger from './pino.logger'
import type { Logger, LoggerConfiguration } from './types'

export class LoggerWrapper implements Logger {
  #underlyingLogger: Logger | null = null
  readonly #emptyMessage: string = ''

  #getInitializeLogger (): Logger {
    this.configureLogger({}, false)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.#underlyingLogger!
  }

  configureLogger (
    configuration: Partial<LoggerConfiguration>,
    overrideIfExists = true
  ): void {
    if (this.#underlyingLogger === null || overrideIfExists) {
      this.#underlyingLogger = new PinoLogger(
        configuration.level ?? 'info',
        configuration.prettyPrint ?? false,
        process.env['NODE_ENV'] !== 'test',
        configuration.label,
        configuration.redact
      )
    }
  }

  resetLogger (): void {
    this.#underlyingLogger = null
  }

  debug (message: object): void
  debug (message: string, metadata?: object): void
  debug (message: string | object, metadata?: object): void {
    if (typeof message === 'string') {
      this.#getInitializeLogger().debug(message, LoggerWrapper.#insertContextIntoMetadata(metadata))
    } else {
      this.#getInitializeLogger().debug(this.#emptyMessage, message)
    }
  }

  error (message: object): void
  error (message: string, metadata?: object): void
  error (message: string | object, metadata?: object): void {
    if (typeof message === 'string') {
      this.#getInitializeLogger().error(message, LoggerWrapper.#insertContextIntoMetadata(metadata))
    } else {
      this.#getInitializeLogger().error(this.#emptyMessage, message)
    }
  }

  fatal (message: object): void
  fatal (message: string, metadata?: object): void
  fatal (message: string | object, metadata?: object): void {
    if (typeof message === 'string') {
      this.#getInitializeLogger().fatal(message, LoggerWrapper.#insertContextIntoMetadata(metadata))
    } else {
      this.#getInitializeLogger().fatal(this.#emptyMessage, message)
    }
  }

  info (message: object): void
  info (message: string, metadata?: object): void
  info (message: string | object, metadata?: object): void {
    // ✅ On initialise la classe pinoLogger si pas instancié
    if (typeof message === 'string') {
      this.#getInitializeLogger().info(message, LoggerWrapper.#insertContextIntoMetadata(metadata))
    } else {
      this.#getInitializeLogger().info(this.#emptyMessage, message)
    }
  }

  warn (message: object): void
  warn (message: string, metadata?: object): void
  warn (message: string | object, metadata?: object): void {
    if (typeof message === 'string') {
      this.#getInitializeLogger().warn(message, LoggerWrapper.#insertContextIntoMetadata(metadata))
    } else {
      this.#getInitializeLogger().warn(this.#emptyMessage, message)
    }
  }

  static #insertContextIntoMetadata (metadata?: object): object | undefined {
    const currentContext = context.getStore()

    if (currentContext === undefined) {
      return metadata
    }

    if (metadata === undefined) {
      return currentContext
    }

    return { ...currentContext, ...metadata }
  }
}

// ✅ Export instance for easy usage
export const logger = new LoggerWrapper()
