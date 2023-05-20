import { logger } from '@stephen-shopopop/logger-poo'
import { HttpTerminator, createHttpTerminator } from 'http-terminator'
import Http from 'node:http'
import { inspect } from 'node:util'
import { AppError } from './appError'
import { errorHandler } from './event'

let httpServerRef: HttpTerminator | undefined

const terminateHttpServerAndExit = async (event: 'SIGINT' | 'SIGTERM'): Promise<void> => {
  logger.error(`App received ${event} event, try to gracefully close the server`)

  if (httpServerRef != null) {
    await httpServerRef.terminate()
  }

  process.exit()
}

const normalizeError = (errorToHandle: unknown): AppError => {
  if (errorToHandle instanceof AppError) {
    return errorToHandle
  }

  if (errorToHandle instanceof Error) {
    const appError = new AppError(errorToHandle.message)

    if (errorToHandle.stack !== undefined) {
      appError.stack = errorToHandle.stack
    }

    return appError
  }

  return new AppError(`Error Handler received a none error instance with type - ${typeof errorToHandle}, value - ${inspect(errorToHandle)}`)
}

export const listenToErrorEvents = (httpServer: Http.Server): void => {
  httpServerRef = createHttpTerminator({
    gracefulTerminationTimeout: Number(process.env['GRACEFUL_TIMEOUT_IN_MS'] ?? '0'),
    server: httpServer
  })

  process.on('uncaughtException', (error) => handleError(error))

  process.on('unhandledRejection', (reason) => handleError(reason))

  process.on('SIGTERM', () => {
    terminateHttpServerAndExit('SIGTERM').catch(error => {
      process.stderr.write(inspect(error))

      process.exit(1)
    })
  })

  process.on('SIGINT', () => {
    terminateHttpServerAndExit('SIGINT').catch(error => {
      process.stderr.write(inspect(error))

      process.exit(1)
    })
  })
}

export const handleError = (errorToHandle: unknown): void => {
  try {
    const appError = normalizeError(errorToHandle)

    logger.error(appError)
    errorHandler.emit('error', appError)

    if (!appError.isTrusted) {
      process.kill(process.pid, 'SIGTERM')
    }
  } catch (handlingError: unknown) {
    process.stdout.write('Error handler failed')
    process.stdout.write(inspect(handlingError))
    process.stdout.write(inspect(errorToHandle))
  }
}
