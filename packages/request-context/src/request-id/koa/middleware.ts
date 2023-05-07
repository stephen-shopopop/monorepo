import type { Context, Next } from 'koa'
import { context } from '../../context'
import { REQUEST_ID_HEADER, generateRequestId } from '../commons'

/**
 * This is an koa middleware
 */
export async function addRequestIdKoaMiddleware (
  ctx: Context,
  next: Next
): Promise<void> {
  let requestId = ctx.headers[REQUEST_ID_HEADER]

  if (requestId === undefined) {
    requestId = generateRequestId()

    ctx.headers[REQUEST_ID_HEADER] = requestId
  }

  ctx.set(REQUEST_ID_HEADER, requestId)

  const currentContext = context.getStore()

  if (currentContext !== undefined) {
    context.add('requestId', requestId)

    await next()

    return
  }

  await context.runAsync({ requestId }, async () => {
    return await next()
  })
}
