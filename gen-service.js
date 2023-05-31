#!/usr/bin/env node

const { execSync } = require('child_process')
const readline = require('readline')
const util = require('util')
const fs = require('fs-extra')
const packageJson = require('./package.json')
const { Console } = require('console')

const logger = new Console({ stdout: process.stdout, stderr: process.stderr })

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const question = util.promisify(rl.question).bind(rl)

// eslint-disable-next-line no-extend-native
String.prototype.toKebabCase = function () {
  return this.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => '-' + chr).trim()
}

// main
async function main () {
  const scope = await question('Enter Scope (default: @stephen-shopopop):') || 'stephen-shopopop'
  const scopeName = scope.toKebabCase()

  const name = await question('What is the name of the service ? ')
  const serviceName = name.toKebabCase()

  const cmd = `npm init --scope=@${scopeName} -y -w ./services/${serviceName}`
  execSync(cmd.toString(), {
    cwd: __dirname,
    stdio: 'inherit'
  })

  // Generate npmignore
  await fs.outputFile(`./services/${serviceName}/.npmignore`, `*
!dist/**
!package.json
!readme.md
`)

  // Generate tsconfig for package
  await fs.writeJSON(`./services/${serviceName}/tsconfig.pkg.json`, {
    extends: '../../tsconfig.build.json',
    compilerOptions: {
      outDir: './dist/'
    },
    include: [
      './**/*.ts'
    ],
    exclude: [
      '**/*.test.ts'
    ]
  }, { spaces: 2 })

  // Generate readme.md
  await fs.outputFile(`./services/${serviceName}/readme.md`, `[![Minimal node version](https://img.shields.io/static/v1?label=node&message=${packageJson.engines.node}&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Minimal npm version](https://img.shields.io/static/v1?label=npm&message=${packageJson.engines.npm}&logo=npm&color)](https://github.com/npm/cli/releases)
[![Linux](https://svgshare.com/i/Zhy.svg)](https://svgshare.com/i/Zhy.svg)
[![macOS](https://svgshare.com/i/ZjP.svg)](https://svgshare.com/i/ZjP.svg)
[![Visual Studio Code](https://img.shields.io/badge/--007ACC?logo=visual%20studio%20code&logoColor=ffffff)](https://code.visualstudio.com/)

# ${serviceName}

## Description

${serviceName} service

## Contributing

1. npm run start - start app
2. npm run dev - start app on dev mode
1. npm run build - Build ts
`)

  // Generate index.ts
  await fs.outputFile(`./services/${serviceName}/start.ts`, `import { AppError, handleError } from '@stephen-shopopop/errorhandler'
  import { logger } from '@stephen-shopopop/logger-poo'
  
  async function start (): Promise<unknown> {
    // 🦉 Array of entry point is being used to support more entry-points kinds like message queue, scheduled job,
    return await Promise.all([])
  }
  
  start()
    .then(() => {
      logger.info('The app has started successfully')
    })
    .catch((error) => {
      // ️️️✅ Best Practice: A failure during startup is catastrophic and should lead to process exit (you may retry before)
      // Consequently, we flag the error as catastrophic
      handleError(
        new AppError('startup-failure', 500, false, error)
      )
    })

`)

  // Generate package.json
  const pkg = require(`./services/${serviceName}/package.json`)
  pkg.types = 'dist/index.d.ts'
  pkg.main = 'dist/index.js'
  pkg.scripts = {
    start: 'PRETTY_PRINT=false node .dist/start.js',
    dev: 'PRETTY_PRINT=true ts-node start.ts',
    build: 'rm -rf dist/* && tsc -p tsconfig.pkg.json'
  }
  pkg.description = ''
  pkg.dependencies = {
    '@stephen-shopopop/errorhandler': '*',
    '@stephen-shopopop/logger': '*'
  }

  await fs.writeJSON(`./services/${serviceName}/package.json`, pkg, { spaces: 2 })
}

main()
  .then(() => process.exit())
  .catch((error) => {
    logger.warn(error)
    process.exitCode(1)
  })
