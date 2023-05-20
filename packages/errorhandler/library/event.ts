import { EventEmitter } from 'node:events'
import { AppError } from './appError'

type ListenerSignature<L> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [E in keyof L]: (...args: any[]) => any;
}

interface TypedPartialEventEmitter<Events extends ListenerSignature<Events>> {
  on: <E extends keyof Events>(event: E, listener: Events[E]) => this
  emit: <E extends keyof Events>(event: E, ...args: Parameters<Events[E]>) => boolean
}

interface ErrorHandle {
  ['errorHandle']: (error: AppError, context?: Record<PropertyKey, unknown>) => Promise<void>
}

const errorHandler = new EventEmitter() as TypedPartialEventEmitter<ErrorHandle>

export { errorHandler }
