import { HTTPStatus, httpStatusCode } from '@stephen-shopopop/http-status'
import axios, { AxiosInstance } from 'axios'
import { Server } from 'http'
import Koa, { Context } from 'koa'
import { AddressInfo } from 'net'
import { jwtVerifierKoaMiddleware } from '../index'
import * as jwtHelper from './jwt-helper'
import { signTokenSynchronously } from './jwt-helper'

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

describe('Error style express middleware', () => {
  afterEach(async () => {
    await stopWebServer()
  })

  describe('JWT middleware koa', () => {
    test('when missing header authorization then should receive unauthorized response', async () => {
      // Arrange
      const jwtMiddleware = jwtVerifierKoaMiddleware({
        secret: jwtHelper.exampleSecret
      })

      const client = setupKoaServer((app) => {
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

      const client = setupKoaServer((app) => {
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

      const client = setupKoaServer((app) => {
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

      const client = setupKoaServer((app) => {
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
      const user = {
        email: 'me@email.com',
        email_verified: false,
        name: 'John',
        sub: 1
      }
      const signValidToken = signTokenSynchronously(user, Date.now() + 60 * 60)

      const jwtMiddleware = jwtVerifierKoaMiddleware({
        secret: jwtHelper.exampleSecret
      })

      const client = setupKoaServer((app) => {
        app.use(jwtMiddleware)

        app.use(async (ctx: Context) => {
          ctx.body = ctx.state?.['user'] ?? {}
        })
      })

      // Act
      const response = await client.get('/', {
        headers: {
          Authorization: signValidToken
        }
      })

      // Assert
      expect(response).toMatchObject({
        data: user,
        status: HTTPStatus.OK
      })
    })
  })
})
