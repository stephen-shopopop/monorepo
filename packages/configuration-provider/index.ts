import convict from 'convict'

let convictConfigurationProvider: convict.Config<any> | undefined

export function initializeAndValidate (schema: any): void {
  convictConfigurationProvider = convict(schema)
  convictConfigurationProvider.validate()
}

export function reset (): void {
  convictConfigurationProvider = undefined
}

export function getValue (keyName: string): string {
  if (convictConfigurationProvider === undefined) {
    throw new Error('Configuration has not been initialized yet')
  }
  // @ts-expect-error
  return convictConfigurationProvider.get(keyName) as string
}
