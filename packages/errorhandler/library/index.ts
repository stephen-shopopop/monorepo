import { logger } from '@stephen-shopopop/logger-poo'
import { context } from '@stephen-shopopop/request-context'
import { HttpTerminator, createHttpTerminator } from 'http-terminator'
import * as Http from 'node:http'
import * as util from 'node:util'
import { AppError } from './appError'
import { event } from './event'

let httpServerRef: HttpTerminator | null

const terminateHttpServerAndExit = async (): Promise<void> => {
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

  return new AppError(`Error Handler received a none error instance with type - ${typeof errorToHandle}, value - ${util.inspect(errorToHandle)}`)
}

export const listenToErrorEvents = (httpServer: Http.Server): void => {
  httpServerRef = createHttpTerminator({
    gracefulTerminationTimeout: Number(process.env['GRACEFUL_TIMEOUT'] ?? '0'),
    server: httpServer
  })

  process.on('uncaughtException', (error) => handleError(error))

  process.on('unhandledRejection', (reason) => handleError(reason))

  process.on('SIGTERM', () => {
    const processEventHandler = async (): Promise<void> => {
      logger.error('Server received SIGTERM event, try to gracefully close the server')

      await terminateHttpServerAndExit()
    }

    processEventHandler().catch(error => {
      process.stderr.write(util.inspect(error))

      process.exit(1)
    })
  })

  process.on('SIGINT', () => {
    const processEventHandler = async (): Promise<void> => {
      logger.error('Server received SIGINT event, try to gracefully close the server')

      await terminateHttpServerAndExit()
    }

    processEventHandler().catch(error => {
      process.stderr.write(util.inspect(error))

      process.exit(1)
    })
  })
}

export const handleError = (errorToHandle: unknown): void => {
  try {
    const appError = normalizeError(errorToHandle)

    logger.error(appError.message, appError)
    event.emit('errorHandle', appError, context.getStore())

    if (!appError.isTrusted) {
      process.kill(process.pid, 'SIGTERM')
    }
  } catch (handlingError: unknown) {
    process.stdout.write('Error handler failed')
    process.stdout.write(util.inspect(handlingError))
    process.stdout.write(util.inspect(errorToHandle))
  }
}
