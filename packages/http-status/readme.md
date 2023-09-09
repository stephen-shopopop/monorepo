[![Minimal node version](https://img.shields.io/static/v1?label=node&message=>=18.15.0&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Minimal npm version](https://img.shields.io/static/v1?label=npm&message=>=8.5.5&logo=npm&color)](https://github.com/npm/cli/releases)
[![Visual Studio Code](https://img.shields.io/badge/--007ACC?logo=visual%20studio%20code&logoColor=ffffff)](https://code.visualstudio.com/)

# Package http-status

- 🚀 Full-featured node
- 🏄‍♀️ Simple usage
- 💬 Help on [github](https://github.com/stephen-shopopop)

## Description

Enum of http status for typescript.

## Installation

```shell
npm install @stephen-shopopop/http-status
```

## Usage

Enum of http status for typescript

```ts
import { HTTPStatus } from '@stephen-shopopop/http-status'

console.log(HTTPStatus.InternalServerError)
// result: 500
```

_httpStatusCode()_:

```ts
import { httpStatusCode } from '@stephen-shopopop/http-status'

console.log(httpStatusCode(500))
// result: "Internal Server Error"
```
