[![Minimal node version](https://img.shields.io/static/v1?label=node&message=>=18.15.0&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Minimal npm version](https://img.shields.io/static/v1?label=npm&message=>=8.5.5&logo=npm&color)](https://github.com/npm/cli/releases)
[![Linux](https://svgshare.com/i/Zhy.svg)](https://svgshare.com/i/Zhy.svg)
[![macOS](https://svgshare.com/i/ZjP.svg)](https://svgshare.com/i/ZjP.svg)
[![Visual Studio Code](https://img.shields.io/badge/--007ACC?logo=visual%20studio%20code&logoColor=ffffff)](https://code.visualstudio.com/)

# postgres-migrate

## Description

postgres-migrate package

## Types

```shell
npm i zod

echo "NODE_ENV=production \
  \nPGDATABASE=postgres \
  \nPGHOST=localhost \
  \nPGPASSWORD=postgres \
  \nPGPORT=5432 \
  \nPGUSER=postgres" >> .env

env $(xargs < .env) npx pgzod --schema public --output ./models --strategy readwrite
```
