import logger from "./library"

export function hello (name: string): string {
  return 'hello ' + name
}

logger.warn(hello(' you'))
