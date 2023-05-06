import { AsyncLocalStorage } from 'node:async_hooks'

export class Context {
  readonly #currentContext: AsyncLocalStorage<Record<PropertyKey, unknown>>

  constructor () {
    this.#currentContext = new AsyncLocalStorage<Record<PropertyKey, unknown>>()
  }

  getStore (): Record<PropertyKey, unknown> | undefined {
    return this.#currentContext.getStore()
  }

  addContext (key: PropertyKey, value: unknown): void {
    const store = this.getStore()

    // Don't block if store not initialize
    if (typeof store === 'object') {
      store[key] = value
    }
  }

  run (initialContext: Record<PropertyKey, unknown>, callback: () => void): void {
    this.#currentContext.run(initialContext, callback)
  }
}

export const context = new Context()
