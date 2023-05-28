import { HTTPStatus } from '@stephen-shopopop/http-status'
import { logger } from '@stephen-shopopop/logger-poo'
import { HttpTerminator, createHttpTerminator } from 'http-terminator'
import diagnostics_channel from 'node:diagnostics_channel'
import type { Server as HttpServer } from 'node:http'
import type { Http2SecureServer } from 'node:http2'
import type { Server as HttpsServer } from 'node:https'
import { inspect } from 'node:util'
import { AppError } from './appError'

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
    const appError = new AppError(errorToHandle.message, HTTPStatus.InternalServerError, true, errorToHandle)

    if (errorToHandle.stack !== undefined) {
      appError.stack = errorToHandle.stack
    }

    return appError
  }

  return new AppError(`Error Handler received a none error instance with type - ${typeof errorToHandle}, value - ${inspect(errorToHandle)}`)
}

/**
 * metricsChannel
 *
 * ```ts
 * function onMessage(message: unknown) {
 *  // Use try catch to evict unhandleExpection
 *  try {
 *   // Received data
 *  } catch { }
 * }
 *
 * // Subscribe to the channel
 * metricsChannel.subscribe(onMessage)
 * 
 * // Check if the channel has an active subscriber
 * if (metricsChannel.hasSubscribers) {
 *   // Publish data to the channel
 *   metricsChannel.publish({
 *     some: 'data'
 *   })
 * }
 * 
 * // Unsubscribe from the channel
 * metricsChannel.unsubscribe(onMessage);
 */
export const metricsChannel = diagnostics_channel.channel(Symbol('app-metrics'))

export const listenToErrorEvents = (server: Http2SecureServer | HttpServer | HttpsServer): void => {
  httpServerRef = createHttpTerminator({
    gracefulTerminationTimeout: Number(process.env['GRACEFUL_TIMEOUT_IN_MS'] ?? '0'),
    server
  })

  process.on('uncaughtException', (error) => handleError(error))

  process.on('unhandledRejection', (reason) => handleError(reason))

  for (const signal of ['SIGTERM', 'SIGINT'] as const) {
    process.on(signal, () => {
      terminateHttpServerAndExit(signal).catch(error => {
        process.stderr.write(inspect(error))

        process.exit(1)
      })
    })
  }
}

export const handleError = (errorToHandle: unknown): void => {
  try {
    const appError = normalizeError(errorToHandle)

    logger.error(appError)

    if (metricsChannel.hasSubscribers) {
      metricsChannel.publish(AppError)
    }

    if (!appError.isTrusted) {
      process.kill(process.pid, 'SIGTERM')
    }
  } catch (handlingError: unknown) {
    process.stdout.write('Error handler failed')
    process.stdout.write(inspect(handlingError))
    process.stdout.write(inspect(errorToHandle))
  }
}
