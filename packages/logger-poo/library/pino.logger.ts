import { LoggerOptions, pino, Logger as PinoLoggerImpl } from 'pino'
import { LOG_LEVELS, Logger } from './types'

// ✅ Use polymorphisme: on implemente l´interface Logger
// ✅ Isolation partielle de la dependance (couplage sur les methodes de la dependance)
// ✅ Typage strict de la configuration
// ✅ Typage strict des methodes
// ✅ Ajout d´une fonctionnalite pour les developpeurs: pino-pretty (interne à la dependance)
export default class PinoLogger implements Logger {
  readonly #logger: PinoLoggerImpl
  readonly #emptyMessage: string = ''

  constructor (
    private readonly level: LOG_LEVELS,
    private readonly prettyPrintEnabled: boolean,
    private readonly enabled: boolean,
    private readonly name?: string,
    private readonly redact?: string[]
  ) {
    const options: LoggerOptions = {
      enabled: this.enabled,
      level: this.level
    }

    if (this.name !== undefined) {
      options.name = this.name
    }

    if (Array.isArray(this.redact)) {
      options.redact = this.redact
    }

    if (this.prettyPrintEnabled) {
      options.transport = {
        target: 'pino-pretty',
        options: {
          colorize: true,
          sync: true
        }
      }
    }

    this.#logger = pino(options)
  }

  #handleMessage (message: string): string | undefined {
    return message !== this.#emptyMessage ? message : undefined
  }

  debug (message: string, metadata?: object): void {
    if (metadata != null) {
      this.#logger.debug(metadata, this.#handleMessage(message))
    } else {
      this.#logger.debug(message)
    }
  }

  error (message: string, metadata?: object): void {
    if (metadata != null) {
      this.#logger.error(metadata, this.#handleMessage(message))
    } else {
      this.#logger.error(message)
    }
  }

  fatal (message: string, metadata?: object): void {
    if (metadata != null) {
      this.#logger.fatal(metadata, this.#handleMessage(message))
    } else {
      this.#logger.fatal(message)
    }
  }

  info (message: string, metadata?: object): void {
    if (metadata != null) {
      this.#logger.info(metadata, this.#handleMessage(message))
    } else {
      this.#logger.info(message)
    }
  }

  warn (message: string, metadata?: object): void {
    if (metadata != null) {
      this.#logger.warn(metadata, this.#handleMessage(message))
    } else {
      this.#logger.warn(message)
    }
  }
}
