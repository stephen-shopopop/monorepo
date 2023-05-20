import pino from 'pino'

// ⛔️ Configuration applicative couplé dans la librairie
// ⛔️ Typage: aucun typage strict protegant le passage d’arguments à la dependance
const logger = pino({ level: process.env['LEVEL'] ?? 'info' })

export { logger }
