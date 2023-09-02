import axios, { AxiosInstance } from 'axios'
import { Server } from 'http'
import Koa, { Context, Next } from 'koa'
import { AddressInfo } from 'net'
import { addRequestIdKoaMiddleware, context } from '../index'
import { REQUEST_ID_HEADER } from '../library/request-id/commons'

let connection: Server | undefined

function setupKoaServer (setupRoutes: (app: Koa) => void): AxiosInstance {
  const app = new Koa()

  setupRoutes(app)

  connection = app.listen(0)

  const { port } = connection.address() as AddressInfo

  return axios.create({
    baseURL: `http://127.0.0.1:${port}`,
    validateStatus: () => true
  })
}

async function stopWebServer (): Promise<void> {
  return await new Promise<void>((resolve) => {
    if (connection !== undefined) {
      connection.close(() => { resolve() })
    }
  })
}

describe('Request ID koa middleware', () => {
  afterEach(async () => {
    await stopWebServer()
  })

  describe('when the request ID already exists in the request header', () => {
    test('when sending a request with request id in the header then add on response header', async () => {
      // Arrange
      const requestId = 'ab1d9251-5916-4b26-85d9-7a33aaa86c9d'

      const client = setupKoaServer((app) => {
        app.use(addRequestIdKoaMiddleware)

        app.use(async (ctx: Context) => {
          ctx.body = {}
        })
      })

      // Act
      const response = await client.get('/', {
        headers: {
          [REQUEST_ID_HEADER]: requestId
        }
      })

      // Assert
      expect(response).toMatchObject({
        data: {},
        headers: {
          [REQUEST_ID_HEADER]: requestId
        },
        status: 200
      })
    })
  })

  describe('when the request id not existing on request header', () => {
    test('when sending without request id then generate and add on response header', async () => {
      // Arrange
      const client = setupKoaServer((app) => {
        app.use(addRequestIdKoaMiddleware)

        app.use(async (ctx: Context) => {
          ctx.body = {}
        })
      })

      // Act
      const response = await client.get('/')

      // Assert
      expect(response).toMatchObject({
        data: {},
        headers: {
          [REQUEST_ID_HEADER]: expect.any(String)
        },
        status: 200
      })
    })
  })

  test('when add context on request and add on reponse body then context on response body', async () => {
    // Arrange
    const existingContextData = {
      userId: 1
    }

    const client = setupKoaServer((app) => {
      app.use(async (_ctx, next: Next) => {
        await context.runAsync({ ...existingContextData }, async () => {
          return await next()
        })
      })

      app.use(addRequestIdKoaMiddleware)

      app.use(async (ctx: Context) => {
        // add context
        context.set('label', 'event')

        ctx.body = { ...context.getStore() }
      })
    })

    // Act
    const response = await client.get('/')

    // Assert
    expect(response).toMatchObject({
      status: 200,
      data: {
        requestId: expect.any(String),
        ...existingContextData,
        label: 'event'
      },
      headers: {
        [REQUEST_ID_HEADER]: expect.any(String)
      }
    })
  })
})
