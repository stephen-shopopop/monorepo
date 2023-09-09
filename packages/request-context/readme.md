[![Minimal node version](https://img.shields.io/static/v1?label=node&message=>=18.15.0&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Minimal npm version](https://img.shields.io/static/v1?label=npm&message=>=8.5.5&logo=npm&color)](https://github.com/npm/cli/releases)
[![Visual Studio Code](https://img.shields.io/badge/--007ACC?logo=visual%20studio%20code&logoColor=ffffff)](https://code.visualstudio.com/)

# Package request context

- 🚀 Full-featured node
- 🏷 Middleware for [express](https://expressjs.com/fr/) & [koa](https://koajs.com)
- 🏄‍♀️ Simple usage
- 🖊️ Dynamic query support
- 💬 Help on [github](https://github.com/stephen-shopopop)

## Description

This package creates stores that stay coherent through asynchronous operations.

## Installation

```shell
npm install @stephen-shopopop/request-context
```

## Usage

### Express

```ts
import express, { Express } from 'express'
import { context } from 'stephen-shopopop/context'

app.use((_req, _res, next) => {
  context.run({}, next)
})

app.use((_req, _res, next) => {
  console.log(context.getStore())
  // print { user: { id: 24 }}

  next()
})

app.get('/', (_req, res) => {
  context.set('user', { id: 24 })

  res.send({...context.get('user')})
})
```

### Koa

```ts
import Koa, { Context, Next } from 'koa'
import { context } from 'stephen-shopopop/context'

app.use(async (_ctx, next: Next) => {
  await context.runAsync({}, async () => {
    return await next()
  })
})

app.use(async (_ctx, next) => {
  console.log(context.getStore())
  // print { user: { id: 24 }}

  await next()
})

app.use(async (ctx: Context) => {
  context.set('user', { id: 24 })

  ctx.body = { ...context.get('user') }
})
```

### http server

```ts
http.createServer((req, res) => {
  context.run({}, () => {
    context.set('user', { id: 24 })

    console.log(context.getStore());
    // print { user: { id: 24 }}

    setImmediate(() => {
      res.write(context.get('user'))
      res.end();
    });
  });
}).listen(8080);
```

## Details

### context.run(initialContext: object, callback: Function) / context.runAsync(initialContext: object, callback: Promise<Function>)

Start an asynchronous local storage context. Once this method is called, a new context is created, for which get and set calls will operate on a set of entities, unique to this context.

- use context.run for express
- use context.runAsync for Koa

### context.set(key: string | number | Symbol, value: unknown)

Sets a variable for a given key within running context. If this is called outside of a running context, it will not store the value.

### context.get(key: string | number | Symbol) - return value: unknown

Gets a variable previously set within a running context. If this is called outside of a running context, it will not retrieve the value.

### context.getStore() - return Record<string | number | Symbol>, unknown>>

Gets all variables previously set within a running context. If this is called outside of a running context, it will not retrieve the value.
