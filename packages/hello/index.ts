import pino from 'pino'

export function hello (name: string): string {
  return 'hello ' + name
}

const logger = pino()

logger.warn(hello(' you'))
