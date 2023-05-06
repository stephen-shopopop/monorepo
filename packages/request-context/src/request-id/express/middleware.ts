import { IncomingMessage, ServerResponse } from 'http'
import { context } from '../../context'
import { REQUEST_ID_HEADER, generateRequestId } from '../commons'

/**
 * This is an express middleware
 */
export function addRequestIdExpressMiddleware (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): void {
  let requestId = req.headers[REQUEST_ID_HEADER] as string | undefined

  if (requestId === undefined) {
    requestId = generateRequestId()
    req.headers[REQUEST_ID_HEADER] = requestId
  }

  res.setHeader(REQUEST_ID_HEADER, requestId)

  const currentContext = context.getStore()

  if (currentContext !== undefined) {
    context.add('requestId', requestId)
    next()
    return
  }

  context.run({ requestId }, next)
}
