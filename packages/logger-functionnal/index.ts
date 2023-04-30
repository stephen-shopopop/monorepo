import loggerWrapper from './library/pino.logger'

// Hello
export function hello (name: string): string {
  return 'hello ' + name
}

console.log(hello(' you'))

loggerWrapper({
  label: 'test',
  prettyPrint: true,
  level: 'debug',
  enabled: false
}).error({ metadata: { surname: 'paul' }, message: 'test' })
loggerWrapper({}).error({ message: '' })
