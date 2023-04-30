type Predicate<T> = (value: T) => Boolean

type Function<T, O> = (value: T) => O

interface Pattern<T, O> {
  predicate: Predicate<T>
  execution: Function<T, O>
}

const throwError = (): any => {
  throw new Error('Error: no pattern matched. Please use a wildcard pattern.')
}

export const when = <T>(predicate: Predicate<T>) => {
  return <ResultExec>(
    execution: Function<T, ResultExec>
  ): Pattern<T, ResultExec> => {
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
