import pino from 'pino'

// ⛔️ Configuration applicative couplé dans la librairie
const logger = pino({ level: process.env.LEVEL ?? 'info' })

export default logger
