export type LOG_LEVELS = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

// ✅ Garantir Interface entre wrapper et pinoLogger
export interface Logger {
  debug: (message: string, metadata?: object) => void
  error: (message: string, metadata?: object) => void
  fatal: (message: string, metadata?: object) => void
  info: (message: string, metadata?: object) => void
  warn: (message: string, metadata?: object) => void
}

export interface LoggerConfiguration {
  level: LOG_LEVELS
  prettyPrint: boolean
  name: string
  redact: string[]
}
