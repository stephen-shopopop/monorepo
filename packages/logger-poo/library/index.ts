import PinoLogger from './pino.logger'
import { Logger, LoggerConfiguration } from './types'

// ✅ Use polymorphisme: on implement l´interface Logger et on ajoute une deuxieme couche d'isolation reservé a l'usage
// ✅ Pas d´heritage de la classe pinoLogger afin de decoupler l´usage et l'isolation de la dependance (separation des responsabilites)
// ✅ Isolation de la dependance
// ✅ Simplification de l´usage de multi-instance du logger
// ✅ Configuration par defaut pour un usage immediat
export class LoggerWrapper implements Logger {
  #underlyingLogger: Logger | null = null
  readonly #emptyMessage: string = ''

  #getInitializeLogger (): Logger {
    this.configureLogger({}, false)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.#underlyingLogger!
  }

  // ✅ Configuration de la librairie avec valeur par defaut
  configureLogger (
    configuration: Partial<LoggerConfiguration>,
    overrideIfExists = true
  ): void {
    if (this.#underlyingLogger === null || overrideIfExists) {
      // ✅ On instancie notre classe ici
      this.#underlyingLogger = new PinoLogger(
        configuration.level ?? 'info',
        configuration.prettyPrint ?? false,
        // ✅ On desactive le logger lorsque des tests sont executé
        process.env['NODE_ENV'] !== 'test',
        // ✅ On nomme chaque logger afin d´indentifier dans le terminal si besoin
        configuration.label,
        // ✅  filtre des données sensible
        configuration.redact
      )
    }
  }

  // ✅ ajout d´une fonctionnalite pour modifier a l'usage la configuration
  resetLogger (): void {
    this.#underlyingLogger = null
  }

  debug (message: object): void
  debug (message: string, metadata?: object): void
  debug (message: string | object, metadata?: object): void {
    // ✅ type guard
    if (typeof message === 'string') {
      this.#getInitializeLogger().debug(message, metadata)
    } else {
      this.#getInitializeLogger().debug(this.#emptyMessage, message)
    }
  }

  error (message: object): void
  error (message: string, metadata?: object): void
  error (message: string | object, metadata?: object): void {
    if (typeof message === 'string') {
      this.#getInitializeLogger().error(message, metadata)
    } else {
      this.#getInitializeLogger().error(this.#emptyMessage, message)
    }
  }

  fatal (message: object): void
  fatal (message: string, metadata?: object): void
  fatal (message: string | object, metadata?: object): void {
    if (typeof message === 'string') {
      this.#getInitializeLogger().fatal(message, metadata)
    } else {
      this.#getInitializeLogger().fatal(this.#emptyMessage, message)
    }
  }

  info (message: object): void
  info (message: string, metadata?: object): void
  info (message: string | object, metadata?: object): void {
    // ✅ On initialise la classe pinoLogger si pas instancié
    if (typeof message === 'string') {
      this.#getInitializeLogger().info(message, metadata)
    } else {
      this.#getInitializeLogger().info(this.#emptyMessage, message)
    }
  }

  warn (message: object): void
  warn (message: string, metadata?: object): void
  warn (message: string | object, metadata?: object): void {
    if (typeof message === 'string') {
      this.#getInitializeLogger().warn(message, metadata)
    } else {
      this.#getInitializeLogger().warn(this.#emptyMessage, message)
    }
  }
}

// ✅ Export instance for easy usage
export const logger = new LoggerWrapper()
