import { logger, LoggerWrapper } from './library'

// ✅ typage strict facilitant l´usage
logger.error('hello the world', { context: 'How are you?' })

// ✅ Overload typage
logger.error(new Error('an error'))

// ✅ Good practice: configuration a la charge de l´applicatif
// Tout les logs qui vont suivre appliqueront la configuration
// ainsi l'usage du logger dans un package tierce est simplifier car la configuration sera applique par le service
logger.configureLogger({
  prettyPrint: Boolean(process.env['PRETTY_PRINT'])
}, true)

// ✅ Amelioration de la lisibilite du log pour le confort du developpement
logger.info('hello the world')

// ✅ On reset le logger
logger.resetLogger()

// ✅ Logger avec config par defaut
logger.warn('Hello the world')

// ✅ On instancie un nouveau logger par la classe LoggerWrapper
const myLogger = new LoggerWrapper()

myLogger.configureLogger({
  label: 'my-logger',
  level: 'warn'
}, true)

// ✅ Le log suivant ne s´affichera pas
myLogger.info('hello the new world')
// mais celui-ci, oui
myLogger.fatal('Hello the new world')

logger.info('thanks !')
