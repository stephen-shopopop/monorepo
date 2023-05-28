[![Minimal node version](https://img.shields.io/static/v1?label=node&message=>=18.15.0&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Minimal npm version](https://img.shields.io/static/v1?label=npm&message=>=8.5.5&logo=npm&color)](https://github.com/npm/cli/releases)
[![Linux](https://svgshare.com/i/Zhy.svg)](https://svgshare.com/i/Zhy.svg)
[![macOS](https://svgshare.com/i/ZjP.svg)](https://svgshare.com/i/ZjP.svg)
[![Visual Studio Code](https://img.shields.io/badge/--007ACC?logo=visual%20studio%20code&logoColor=ffffff)](https://code.visualstudio.com/)

# Error handler

## Description

errorHandler package

### metricsChannel

usage:

```ts
import { metricsChannek } from '@stephen-shopopop/errorHandler'

function onMessage (message: unknown) {
  try {
    // Received data
  } catch { /** */ }
}

// Subscribe to the channel
metricsChannel.subscribe(onMessage)

// Check if the channel has an active subscriber
if (metricsChannel.hasSubscribers) {
  // Publish data to the channel
  metricsChannek.publish({
    some: 'data'
  })
}

// Unsubscribe from the channel
metricsChannel.unsubscribe(onMessage)
```

## Contributing

1. npm run build - Build ts
