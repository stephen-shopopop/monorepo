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

  const name = await question('What is the name of the package ? ')
  const packageName = name.toKebabCase()

  const cmd = `npm init --scope=@${scopeName} -y -w ./packages/${packageName}`
  execSync(cmd.toString(), {
    cwd: __dirname,
    stdio: 'inherit'
  })

  // Generate npmignore
  await fs.outputFile(`./packages/${packageName}/.npmignore`, `*
!dist/**
!package.json
!readme.md
`)

  // Generate tsconfig for package
  await fs.writeJSON(`./packages/${packageName}/tsconfig.pkg.json`, {
    extends: '../../tsconfig.build.json',
    compilerOptions: {
      declaration: true,
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
  await fs.outputFile(`./packages/${packageName}/readme.md`, `[![Minimal node version](https://img.shields.io/static/v1?label=node&message=${packageJson.engines.node}&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Minimal npm version](https://img.shields.io/static/v1?label=npm&message=${packageJson.engines.npm}&logo=npm&color)](https://github.com/npm/cli/releases)
[![Linux](https://svgshare.com/i/Zhy.svg)](https://svgshare.com/i/Zhy.svg)
[![macOS](https://svgshare.com/i/ZjP.svg)](https://svgshare.com/i/ZjP.svg)
[![Visual Studio Code](https://img.shields.io/badge/--007ACC?logo=visual%20studio%20code&logoColor=ffffff)](https://code.visualstudio.com/)

# ${packageName}

## Description

${packageName} package

## Contributing

1. npm run build - Build ts
`)

  // Generate index.ts
  await fs.outputFile(`./packages/${packageName}/index.ts`, `// Hello
export function hello (name: string): string {
  return 'hello ' + name
}

`)

  // Generate index.test.ts
  await fs.outputFile(`./packages/${packageName}/index.test.ts`, `import { describe, expect, test } from '@jest/globals'
import { hello } from './index'

describe('[${packageName}] hello()', () => {
  test('When hello("john") then return "hello john', () => {
    // Arrange
    const name = 'john'

    // Act
    const message = hello(name)

    // Assert
    expect(message).toBe('hello you')
  })
})
`)

  // Generate package.json
  const pkg = require(`./packages/${packageName}/package.json`)
  pkg.types = 'dist/index.d.ts'
  pkg.main = 'dist/index.js'
  pkg.scripts = {
    build: 'rm -rf dist/* && tsc -p tsconfig.pkg.json',
    prepack: 'npm run build'
  }
  publishConfig: {
    access: 'public'
  }
  pkg.description = ''

  await fs.writeJSON(`./packages/${packageName}/package.json`, pkg, { spaces: 2 })

  // const cmdPkgs = `npm install pino --workspace=@${scopeName}/${packageName}`
  // execSync(cmdPkgs.toString(), {
  //   cwd: __dirname,
  //   stdio: 'inherit'
  // })
}

main()
  .then(() => process.exit())
  .catch((error) => {
    logger.warn(error)
    process.exitCode(1)
  })
