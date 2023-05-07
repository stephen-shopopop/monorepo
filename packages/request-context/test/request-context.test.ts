import sinon from 'sinon'
import { context } from '../index'

describe('request-context', () => {
  test('When instantiating a new context with initial context, then should return the initial context', () => {
    // Arrange
    const getCurrentContext = sinon.spy(() => context.getStore())

    const initContext = { requestId: 'a' }

    // Act
    context.run({ ...initContext }, getCurrentContext)

    // Assert
    expect({
      getStoreSpyReturnValue: getCurrentContext.returnValues[0]
    }).toEqual({
      getStoreSpyReturnValue: initContext
    })
  })

  test('When instantiating a new context object and add properties, then return keys/values of store', () => {
    // Arrange
    const getCurrentContext = sinon.spy(() => context.getStore())
    let message, props: any

    // Act
    context.run({}, () => {
      context.set('message', 'Yala')
      context.set('label', 'koa')

      getCurrentContext()

      message = context.get('message')
      props = context.get('props')
    })

    // Assert
    expect(message).toBe('Yala')
    expect(props).toBeUndefined()
    expect({
      getStoreSpyReturnValue: getCurrentContext.returnValues[0]
    }).toEqual({
      getStoreSpyReturnValue: {
        label: 'koa',
        message: 'Yala'
      }
    })
  })

  test('When no instantiating a new context, then return undefined', () => {
    // Arrange
    context.set('message', 'yala')

    // Act
    const getStore = context.getStore()

    // Assert
    expect(getStore).toEqual(undefined)
  })
})
