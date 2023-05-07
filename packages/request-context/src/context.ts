import { AsyncLocalStorage } from 'node:async_hooks'

export class Context<T extends object = Record<PropertyKey, unknown>> {
  readonly #currentContext: AsyncLocalStorage<T>

  constructor () {
    this.#currentContext = new AsyncLocalStorage<T>()
  }

  getStore (): T | undefined {
    return this.#currentContext.getStore()
  }

  set <E extends keyof T>(key: E, value: T[E]): void {
    const store = this.getStore()

    // Don't block if store not a record
    if (typeof store === 'object' && store !== null) {
      store[key] = value
    }
  }

  get <E extends keyof T>(key: E): T[E] | undefined {
    const store = this.getStore()

    if (typeof store === 'object' && store !== null) {
      return store[key]
    }

    return undefined
  }

  /**
   * Sync usage example: Express
   */
  run (initialContext: T, callback: () => void): void {
    this.#currentContext.run(initialContext, callback)
  }

  /**
   * Async usage example: Koa midddleware
   */
  async runAsync (initialContext: T, callback: () => Promise<void>): Promise<void> {
    await this.#currentContext.run(initialContext, callback)
  }
}

export const context = new Context()
