[![Minimal node version](https://img.shields.io/static/v1?label=node&message=>=18.15.0&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Minimal npm version](https://img.shields.io/static/v1?label=npm&message=>=8.5.5&logo=npm&color)](https://github.com/npm/cli/releases)
[![Visual Studio Code](https://img.shields.io/badge/--007ACC?logo=visual%20studio%20code&logoColor=ffffff)](https://code.visualstudio.com/)

# Package errorhandler

- 🚀 Full-featured node
- 🏷 Middleware for [express](https://expressjs.com/fr/) & [koa](https://koajs.com)
- 🏄‍♀️ Simple usage
- 💬 Help on [github](https://github.com/stephen-shopopop)

## Description

## Installation

```shell
npm install @stephen-shopopop/errorhandler
```

## Details

### metricsChannel

usage:

```ts
import { metricsChannel } from '@stephen-shopopop/errorHandler'

function onMessage (error: unknown) {
  try {
    // Received data
    if (error instanceof AppError) {
       // Access to all properies AppError
       // error.name: error name (AppError)
       // error.message: error message
       // error.HttpStatus: http status code
       // error.isTrusted: error is trusted
       // error.cause: cause of error (it´s possible is an othe Error or object)
       // error.stack: error stack trace
       // error.context: usage context (depends of package request-context)
    }
  } catch { /** */ }
}

// Subscribe to the metrics channel
metricsChannel.subscribe(onMessage)
```
