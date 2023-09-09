[![Minimal node version](https://img.shields.io/static/v1?label=node&message=%3E=18.15&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Minimal npm version](https://img.shields.io/static/v1?label=npm&message=%3E=8.5.5&logo=npm&color)](https://github.com/npm/cli/releases)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/stephen-shopopop/node-ts/graphs/commit-activity)
[![Visual Studio Code](https://img.shields.io/badge/--007ACC?logo=visual%20studio%20code&logoColor=ffffff)](https://code.visualstudio.com/)
[![CodeQL](https://github.com/stephen-shopopop/logger/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/stephen-shopopop/logger/actions/workflows/github-code-scanning/codeql)
[![pages-build-deployment](https://github.com/stephen-shopopop/logger/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/stephen-shopopop/logger/actions/workflows/pages/pages-build-deployment)
[![Tests](https://github.com/stephen-shopopop/logger/actions/workflows/test.yml/badge.svg)](https://github.com/stephen-shopopop/logger/actions/workflows/test.yml)

<img align="left" width="300" height="180" alt="Monorepo toolbox for developpers" src="https://github.com/stephen-shopopop/monorepo/blob/487b71adb0bc81407c8b1f78cc05673bb6384b0b/IMG_0934.jpeg">

- 🚀 Full-featured node
- 🏷 Good practices
- 🏄‍♀️ Simple usage for developpers
- 🖊️ Typescript compliance
- 💬 Help on [github](https://github.com/stephen-shopopop)

<br>

# Monorepo

## Description

Les bonnes pratiques d´un projet en monorepo

## Installation nodejs via nvm (node version manager)

- [macos/linux](https://github.com/nvm-sh/nvm) or use Makefile command: ```make nvm```
- [windows](https://github.com/coreybutler/nvm-windows)

## Contributing

1. npm run lint - Lint your code.
2. npm run lint:fix - Lint & fix your code.

## Install package

```bash
npm install <package> --workspace=<workspace>
```

## Production

```bash
nvm use

npm run build

// run with ts-node
npm run dev

npm start

npm test

npm run clean

npm run maintenance

```

### Package maintenance

A modern cli tool that keeps your deps fresh

```bash
npx taze -r

// major
npx taze major -r
```
