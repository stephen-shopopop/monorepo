import convict from 'convict'

let convictConfigurationProvider: convict.Config<any> | undefined

export const initializeAndValidate = (schema: any): void => {
  convictConfigurationProvider = convict(schema)
  convictConfigurationProvider.validate()
}

export const reset = (): void => {
  convictConfigurationProvider = undefined
}

export const getValue = (key: string): string => {
  if (convictConfigurationProvider === undefined) {
    throw new Error('Configuration has not been initialized yet')
  }
  // @ts-expect-error
  return convictConfigurationProvider.get(key) as string
}
