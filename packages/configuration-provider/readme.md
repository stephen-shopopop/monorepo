[![Minimal node version](https://img.shields.io/static/v1?label=node&message=>=18.15.0&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Minimal npm version](https://img.shields.io/static/v1?label=npm&message=>=8.5.5&logo=npm&color)](https://github.com/npm/cli/releases)
[![Linux](https://svgshare.com/i/Zhy.svg)](https://svgshare.com/i/Zhy.svg)
[![macOS](https://svgshare.com/i/ZjP.svg)](https://svgshare.com/i/ZjP.svg)
[![Visual Studio Code](https://img.shields.io/badge/--007ACC?logo=visual%20studio%20code&logoColor=ffffff)](https://code.visualstudio.com/)

# configuration-provider

## Description

configuration-provider package

create config.ts file

```ts
export default {
  port: {
    doc: 'The API listening port. By default is 0 (ephemeral) which serves as a dynamic port for testing purposes. For production use, a specific port must be assigned',
    format: 'Number',
    default: 0,
    nullable: true,
    env: 'PORT',
  }
}
```

Usage

```ts
import * as configurationProvider from '@stephen-shopopop/configuration-provider'
import configurationSchema from '../../config'

// Initialize configuration provider
configurationProvider.initializeAndValidate(configurationSchema)

...

// Get value configuration
configurationProvider.getValue('port')
```

## Documentation

- [convict](https://github.com/mozilla/node-convict/tree/master/packages/convict)

## Contributing

1. npm run build - Build ts
