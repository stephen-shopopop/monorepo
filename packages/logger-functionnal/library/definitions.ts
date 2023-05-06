export type LOG_LEVELS = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface Logger {
  configureLogger: (configuration: Partial<LoggerConfiguration>, overrideIfExists: boolean) => void
  debug: ((message: object) => void) & ((message: string | object, metadata?: object) => void)
  error: ((message: object) => void) & ((message: string | object, metadata?: object) => void)
  fatal: ((message: object) => void) & ((message: string | object, metadata?: object) => void)
  info: ((message: object) => void) & ((message: string | object, metadata?: object) => void)
  warn: ((message: object) => void) & ((message: string | object, metadata?: object) => void)
  resetLogger: () => void
  insertContextIntoMetadata: (metadata?: object) => object | undefined
}

export interface LoggerConfiguration {
  level: LOG_LEVELS
  prettyPrint: boolean
  label: string | undefined
  redact: string[] | undefined
}
