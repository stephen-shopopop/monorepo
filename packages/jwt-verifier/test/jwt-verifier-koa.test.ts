import { HTTPStatus, httpStatusCode } from '@stephen-shopopop/http-status'
import axios, { AxiosInstance } from 'axios'
import { Server } from 'http'
import Koa, { Context } from 'koa'
import { AddressInfo } from 'net'
import { jwtVerifierKoaMiddleware } from '../index'
import * as jwtHelper from './jwt-helper'

let connection: Server | undefined

async function setupKoaServer (setupRoutes: (app: Koa) => void): Promise<AxiosInstance> {
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

describe('Error style express middleware', () => {
  afterEach(async () => {
    await stopWebServer()
  })

  describe('JWT middleware express', () => {
    test('when missing header authorization then should receive unauthorized response', async () => {
      // Arrange
      const jwtMiddleware = jwtVerifierKoaMiddleware({
        secret: jwtHelper.exampleSecret
      })

      const client = await setupKoaServer((app) => {
        app.use(jwtMiddleware)

        app.use(async (ctx: Context) => {
          ctx.body = {}
        })
      })

      // Act
      const response = await client.get('/')

      // Assert
      expect(response).toMatchObject({
        data: {
          error: {
            code: HTTPStatus.Unauthorized,
            details: {},
            message: httpStatusCode(HTTPStatus.Unauthorized)
          }
        },
        status: HTTPStatus.Unauthorized
      })
    })

    test('when using empty token then should receive unauthorized response', async () => {
      // Arrange
      const jwtMiddleware = jwtVerifierKoaMiddleware({
        secret: jwtHelper.exampleSecret
      })

      const client = await setupKoaServer((app) => {
        app.use(jwtMiddleware)

        app.use(async (ctx: Context) => {
          ctx.body = {}
        })
      })

      // Act
      const response = await client.get('/', {
        headers: {
          Authorization: ''
        }
      })

      // Assert
      expect(response).toMatchObject({
        data: {
          error: {
            code: HTTPStatus.Unauthorized,
            details: {},
            message: httpStatusCode(HTTPStatus.Unauthorized)
          }
        },
        status: HTTPStatus.Unauthorized
      })
    })

    test('when using valid token with invalid claim then should receive forbbiden response', async () => {
      // Arrange
      const jwtMiddleware = jwtVerifierKoaMiddleware({
        secret: jwtHelper.exampleSecret
      })

      const client = await setupKoaServer((app) => {
        app.use(jwtMiddleware)

        app.use(async (ctx: Context) => {
          ctx.body = {}
        })
      })

      // Act
      const response = await client.get('/', {
        headers: {
          Authorization: jwtHelper.signInvalidToken()
        }
      })

      // Assert
      expect(response).toMatchObject({
        data: {
          error: {
            code: HTTPStatus.Forbidden,
            details: {},
            message: httpStatusCode(HTTPStatus.Forbidden)
          }
        },
        status: HTTPStatus.Forbidden
      })
    })

    test('when using expired token then should receive forbbiden response', async () => {
      // Arrange
      const jwtMiddleware = jwtVerifierKoaMiddleware({
        secret: jwtHelper.exampleSecret
      })

      const client = await setupKoaServer((app) => {
        app.use(jwtMiddleware)

        app.use(async (ctx: Context) => {
          ctx.body = {}
        })
      })

      // Act
      const response = await client.get('/', {
        headers: {
          Authorization: jwtHelper.signExpiredToken()
        }
      })

      // Assert
      expect(response).toMatchObject({
        data: {
          error: {
            code: HTTPStatus.Unauthorized,
            details: {},
            message: httpStatusCode(HTTPStatus.Unauthorized)
          }
        },
        status: HTTPStatus.Unauthorized
      })
    })

    test('when using valid token with valid claim then should receive ok response', async () => {
      // Arrange
      const jwtMiddleware = jwtVerifierKoaMiddleware({
        secret: jwtHelper.exampleSecret
      })

      const client = await setupKoaServer((app) => {
        app.use(jwtMiddleware)

        app.use(async (ctx: Context) => {
          ctx.body = {}
        })
      })

      // Act
      const response = await client.get('/', {
        headers: {
          Authorization: jwtHelper.signValidToken()
        }
      })

      // Assert
      expect(response).toMatchObject({
        data: {},
        status: HTTPStatus.OK
      })
    })
  })
})
