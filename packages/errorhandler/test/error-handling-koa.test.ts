import { HTTPStatus, httpStatusCode } from '@stephen-shopopop/http-status'
import axios, { AxiosInstance } from 'axios'
import { Server } from 'http'
import Koa, { Context } from 'koa'
import { AddressInfo } from 'net'
import { AppError } from '../library/appError'
import { defineErrorHandlingKoaMiddleware } from '../library/error-handling/koa/middleware'

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

describe('Error handling koa middleware', () => {
  afterEach(async () => {
    await stopWebServer()
  })

  test('when sending a request then nothing to add', async () => {
    // Arrange
    const client = setupKoaServer((app) => {
      app.use(defineErrorHandlingKoaMiddleware)

      app.use(async (ctx: Context) => {
        ctx.body = {}
      })
    })

    // Act
    const response = await client.get('/')

    // Assert
    expect(response).toMatchObject({
      data: {},
      status: HTTPStatus.OK
    })
  })

  test('when sending request on route throw an Error then response json with status 500', async () => {
    // Arrange
    const client = setupKoaServer((app) => {
      app.use(defineErrorHandlingKoaMiddleware)

      app.use(async (_ctx: Context) => {
        throw new Error('I am an error')
      })
    })

    // Act
    const response = await client.get('/')

    // Assert
    expect(response).toMatchObject({
      data: {
        error: {
          code: HTTPStatus.InternalServerError,
          message: httpStatusCode(HTTPStatus.InternalServerError)
        }
      },
      status: HTTPStatus.InternalServerError
    })
  })

  test('when sending request on route throw an AppError with object context then response json with details', async () => {
    // Arrange
    const details = {
      name: 'name is required'
    }

    const client = setupKoaServer((app) => {
      app.use(defineErrorHandlingKoaMiddleware)

      app.use(async (_ctx: Context) => {
        throw new AppError('Fields required', 400, true, details)
      })
    })

    // Act
    const response = await client.get('/')

    // Assert
    expect(response).toMatchObject({
      data: {
        error: {
          code: HTTPStatus.BadRequest,
          message: httpStatusCode(HTTPStatus.BadRequest),
          details
        }
      },
      status: HTTPStatus.BadRequest
    })
  })

  test('when sending request on route throw an AppError with an error context then response json with details empty object', async () => {
    // Arrange
    const details = new Error('Oups')

    const client = setupKoaServer((app) => {
      app.use(defineErrorHandlingKoaMiddleware)

      app.use(async (_ctx: Context) => {
        throw new AppError('Fields required', 400, true, details)
      })
    })

    // Act
    const response = await client.get('/')

    // Assert
    expect(response).toMatchObject({
      data: {
        error: {
          code: HTTPStatus.BadRequest,
          message: httpStatusCode(HTTPStatus.BadRequest),
          details: {}
        }
      },
      status: HTTPStatus.BadRequest
    })
  })

  test('when sending request on route throw an AppError with an array context then response json with details empty object', async () => {
    // Arrange
    const details = ['summary']

    const client = setupKoaServer((app) => {
      app.use(defineErrorHandlingKoaMiddleware)

      app.use(async (_ctx: Context) => {
        throw new AppError('Fields required', 400, true, details)
      })
    })

    // Act
    const response = await client.get('/')

    // Assert
    expect(response).toMatchObject({
      data: {
        error: {
          code: HTTPStatus.BadRequest,
          message: httpStatusCode(HTTPStatus.BadRequest),
          details: { 0: 'summary' }
        }
      },
      status: HTTPStatus.BadRequest
    })
  })
})
