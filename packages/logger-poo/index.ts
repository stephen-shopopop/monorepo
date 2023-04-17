import { logger } from './library'

// ✅ typage strict facilitant l´usage
logger.error('hello the world', new Error('Oups'))

// ✅ Overload typage
logger.error({ context: 'How are you?' })

// ✅ Good practice: configuration a la charge de l´applicatif
logger.configureLogger({
  prettyPrint: Boolean(process.env['PRETTY_PRINT'])
}, true)

logger.info('hello the world')

// ✅ On reset le logger
logger.resetLogger()

// ✅  on instancie un nouveau logger
logger.configureLogger({
  label: 'myService',
  prettyPrint: Boolean(process.env['PRETTY_PRINT'])
}, true)

logger.warn('Hello the world')
