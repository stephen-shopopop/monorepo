type Handle<T> = (value: T) => T | Promise<T>

export function pipe <T> (...functions: Array<Handle<T>>): Handle<T> {
  return (arg: T): T =>
    functions
      .reduce((prev: T, currentFn: Function) =>
        prev instanceof Promise
          ? prev.then(value => currentFn(value))
          : currentFn(prev)
      , arg)
}
