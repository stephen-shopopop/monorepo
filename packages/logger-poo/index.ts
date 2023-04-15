import { logger } from './library'

process.env['PRETTY_PRINT'] = 'true'

// ✅ typage strict facilitant l´usage
logger.error('hello the world', new Error('Oups'))

// ✅ Good practice: configuration a la charge de l´applicatif
logger.configureLogger({
  prettyPrint: Boolean(process.env['PRETTY_PRINT'])
}, true)

logger.info('hello the world')

// ✅ On reset le logger
logger.resetLogger()

// ✅  on instancie un nouveau logger
logger.configureLogger({
  name: 'myService',
  prettyPrint: Boolean(process.env['PRETTY_PRINT'])
}, true)

logger.warning('Hello the world')
