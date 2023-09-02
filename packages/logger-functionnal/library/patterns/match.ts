type Predicate<T> = (value: T) => boolean

type Function<T, Result> = (value: T) => Result

interface Pattern<T, Result> {
  predicate: Predicate<T>
  execution: Function<T, Result>
}

const throwError = (): any => {
  throw new Error('Error: no pattern matched. Please use a wildcard pattern.')
}

export const when = <T>(predicate: Predicate<T>) => {
  return <Result>(
    execution: Function<T, Result>
  ): Pattern<T, Result> => {
    return {
      predicate,
      execution
    }
  }
}

export const match = <T>(value: T) =>
  <Result>(...patterns: Array<Pattern<T, Result>>) =>
    (defaultEvent?: Function<T, Result>): Result => {
      const [filteredPattern] = patterns.filter(
        (pattern: Pattern<T, Result>) => pattern.predicate(value)
      )

      return filteredPattern !== undefined
        ? filteredPattern.execution(value)
        : typeof defaultEvent === 'function'
          ? defaultEvent(value)
          : throwError()
    }
