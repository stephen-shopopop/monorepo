export interface Make<T = unknown> {
  subcribe: (topic: string | Symbol, fn: (event: Event<T>) => void) => void
  publish: (topic: string | Symbol, data: T) => void
  unsubcribe: (topic: string | Symbol, fn?: (event: Event<T>) => void) => void
}

export interface Event<T> {
  timestamp: number
  data: T
}
