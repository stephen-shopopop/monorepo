import logger from './library'

// ⚠️ Fort couplage avec pino
// Complexity: demande au dev de bien verifier que les methodes de pino soit compatible avec une autre dependance.
// ⚠️ Typage hérité de la dependance, peut engendrer une contradiction sur l´usage applicatif
logger.warn('hello')

// ⛔️ Couplage trop present
// Utilisation d'une methode propre à pino: impossible de permuter avec une autre dependance
logger.on('level-change', () => console.log('Level has change'))
