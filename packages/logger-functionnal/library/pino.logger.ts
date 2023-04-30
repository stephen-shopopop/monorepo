import { LoggerOptions, pino, Logger as PinoLoggerImpl } from 'pino'
import { LoggerConfiguration } from './definitions'
import { match, when } from './patterns'

export interface PinoLogger {
  debug: (props: PinoLoggerProps) => void
  error: (props: PinoLoggerProps) => void
  fatal: (props: PinoLoggerProps) => void
  info: (props: PinoLoggerProps) => void
  warn: (props: PinoLoggerProps) => void
}

interface PinoConfiguration extends LoggerConfiguration {
  enabled: boolean
}

interface PinoLoggerProps {
  metadata: object | undefined
  message?: string
}

const pinoConfiguration = ({
  enabled = true,
  label,
  level = 'info',
  prettyPrint,
  redact
}: Readonly<Partial<PinoConfiguration>>): LoggerOptions => {
  const configuration: LoggerOptions = {}

  if (label !== undefined) { configuration.name = label }

  if (Array.isArray(redact)) { configuration.redact = redact }

  if (prettyPrint === true) {
    configuration.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        sync: true
      }
    }
  }

  return {
    ...configuration,
    enabled,
    level
  }
}

const nope = (): [] => []
const hasMessage = ({ message }: PinoLoggerProps): boolean => message !== undefined && message.length > 0
const hasMetadata = ({ metadata }: PinoLoggerProps): boolean => metadata !== undefined
const hasMetadataOnly = (props: PinoLoggerProps): boolean => hasMetadata(props) && !hasMessage(props)

const handleLoggerProps = (props: PinoLoggerProps): [string | object | undefined, string | undefined] =>
  match(props)(
    when(hasMetadataOnly)(({ metadata }: PinoLoggerProps) => [metadata]),
    when(hasMetadata)(({ message, metadata }: PinoLoggerProps) => [metadata, message]),
    when(hasMessage)(({ message }: PinoLoggerProps) => [message])
  )(nope) as [string | object | undefined, string | undefined]

const pinoLogger = (
  configuration: Partial<PinoConfiguration>
): PinoLogger => {
  const pinoLogger: PinoLoggerImpl = pino(pinoConfiguration(configuration))

  return {
    debug: (props) => pinoLogger.debug(...handleLoggerProps(props)),
    error: (props) => pinoLogger.error(...handleLoggerProps(props)),
    fatal: (props) => pinoLogger.fatal(...handleLoggerProps(props)),
    info: (props) => pinoLogger.info(...handleLoggerProps(props)),
    warn: (props) => pinoLogger.warn(...handleLoggerProps(props))
  }
}

export default pinoLogger
