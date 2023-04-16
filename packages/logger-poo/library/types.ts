export type LOG_LEVELS = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface Logger {
  debug: (message: string, metadata?: object) => void
  error: (message: string, metadata?: object) => void
  fatal: (message: string, metadata?: object) => void
  info: (message: string, metadata?: object) => void
  warning: (message: string, metadata?: object) => void
}

export interface LoggerConfiguration {
  level: LOG_LEVELS
  prettyPrint: boolean
  name: string
  redact: string[]
}
