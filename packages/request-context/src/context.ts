import { AsyncLocalStorage } from 'node:async_hooks'

export class Context<T extends object = Record<PropertyKey, unknown>> {
  readonly #currentContext: AsyncLocalStorage<T>

  constructor () {
    this.#currentContext = new AsyncLocalStorage<T>()
  }

  getStore (): T | undefined {
    return this.#currentContext.getStore()
  }

  add <E extends keyof T>(key: E, value: T[E]): void {
    const store = this.getStore()

    // Don't block if store not initialize
    if (typeof store === 'object' && store !== null) {
      store[key] = value
    }
  }

  run (initialContext: T, callback: () => void): void {
    this.#currentContext.run(initialContext, callback)
  }
}

export const context = new Context()
