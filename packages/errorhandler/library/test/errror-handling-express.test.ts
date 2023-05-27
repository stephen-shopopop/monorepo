import { HTTPStatus, httpStatusCode } from '@stephen-shopopop/http-status'
import axios, { AxiosInstance } from 'axios'
import express, { Express } from 'express'
import { Server } from 'http'
import { AddressInfo } from 'net'
import { AppError } from '../appError'
import { defineErrorStyleExpressMiddleware } from '../error-handling/express/middleware'

let connection: Server | undefined

async function setupExpressServer (setupRoutes: (app: Express) => void): Promise<AxiosInstance> {
  const app = express()

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

  describe('when the route exists', () => {
    test('when sending a request then nothing to add', async () => {
      // Arrange
      const client = await setupExpressServer((app) => {
        app.get('/', (_req, res) => {
          res.send({})
        })

        defineErrorStyleExpressMiddleware(app)
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
      const client = await setupExpressServer((app) => {
        app.get('/', (_req, _res) => {
          throw new Error('I am an error')
        })

        defineErrorStyleExpressMiddleware(app)
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

      const client = await setupExpressServer((app) => {
        app.get('/', (_req, _res) => {
          throw new AppError('Fields required', 400, true, details)
        })

        defineErrorStyleExpressMiddleware(app)
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

      const client = await setupExpressServer((app) => {
        app.get('/', (_req, _res) => {
          throw new AppError('Fields required', 400, true, details)
        })

        defineErrorStyleExpressMiddleware(app)
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

      const client = await setupExpressServer((app) => {
        app.get('/', (_req, _res) => {
          throw new AppError('Fields required', 400, true, details)
        })

        defineErrorStyleExpressMiddleware(app)
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

  describe('when the route no existing', () => {
    test('when sending a request then nothing to add', async () => {
      // Arrange
      const client = await setupExpressServer((app) => {
        app.get('/', (_req, res) => {
          res.send({})
        })

        defineErrorStyleExpressMiddleware(app)
      })

      // Act
      const response = await client.get('/no-route-existing')

      // Assert
      expect(response).toMatchObject({
        data: {
          error: {
            code: HTTPStatus.NotFound,
            message: httpStatusCode(HTTPStatus.NotFound),
            details: {}
          }
        },
        status: HTTPStatus.NotFound
      })
    })
  })
})
