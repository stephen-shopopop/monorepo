import type express from 'express'
import { context } from '../../context'
import { REQUEST_ID_HEADER, generateRequestId } from '../commons'

/**
 * This is an express middleware
 */
export function addRequestIdExpressMiddleware (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  let requestId = req.headers[REQUEST_ID_HEADER]

  if (requestId === undefined) {
    requestId = generateRequestId()

    req.headers[REQUEST_ID_HEADER] = requestId
  }

  res.setHeader(REQUEST_ID_HEADER, requestId)

  const currentContext = context.getStore()

  if (currentContext !== undefined) {
    context.set('requestId', requestId)

    next()

    return
  }

  context.run({ requestId }, next)
}
