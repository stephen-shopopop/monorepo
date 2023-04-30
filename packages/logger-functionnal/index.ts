import { logger, loggerWrapper } from './library'

// ✅ typage strict facilitant l´usage
logger.error('hello the world', { context: 'How are you?' })

// ✅ Overload typage
logger.error(new Error('an error'))

logger.configureLogger({
  level: 'debug',
  prettyPrint: true
}, true)
// ✅ Amelioration de la lisibilite du log pour le confort du developpement
logger.info('hello the world')

// ✅ On reset le logger
logger.resetLogger()

// ✅ Logger avec config par defaut
logger.warn('Hello the world')

// ✅ On instancie un nouveau logger par la classe LoggerWrapper
const myLogger = loggerWrapper()

myLogger.configureLogger({
  label: 'my-logger',
  level: 'warn'
}, true)

// ✅ Le log suivant ne s´affichera pas
myLogger.info('hello the new world')
// mais celui-ci, oui
myLogger.fatal('Hello the new world')

logger.info('thanks !')
