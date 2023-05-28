import { Make } from './definitions'

/**
 * Make channel
 * @param maxSubscribers
 * @returns
 */
export function make <T> (maxSubscribers = 20): Make<T> {
  const limit = Math.abs(+maxSubscribers - 1)

  const n = new Map<string | Symbol, Function[]>()

  return {
    /**
     * Subscribe to an topic
     *
     * @param topic
     * @param fn
     */
    subcribe: (topic, fn): void => {
      if (typeof fn !== 'function') return

      const i = n.get(topic) ?? []

      if (i.length > limit) return

      (i.length > 0 && i.push(fn) > 0) || n.set(topic, [fn])
    },

    /**
     * Publish event to topic
     *
     * @param topic
     * @param data
     */
    publish: (topic, data): void => {
      (n.get(topic) ?? [])
        .slice()
        .map(fn => {
          try {
            fn({
              timestamp: Date.now(),
              data
            })
          } catch { /** */ }

          return undefined
        })
    },

    /**
     * Unsubscribe to an topic
     *
     * @param topic
     * @param fn
     */
    unsubcribe: (topic, fn?): void => {
      fn ?? n.delete(topic)

      const i = n.get(topic)

      if ((fn != null) && i != null) while (i.includes(fn)) i.splice(i.indexOf(fn), 1)
    }
  }
}
