/* eslint-disable camelcase */
import mysql from 'mysql2/promise'
import { Console } from 'node:console'
import { fileURLToPath } from 'node:url'
import migrate from '../index.js'

const logger = new Console({ stdout: process.stdout, stderr: process.stderr })

const {
  MYSQL_DB,
  MYSQL_PASSWORD,
  MYSQL_USER
} = process.env

const sql = await mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  database: MYSQL_DB,
  password: MYSQL_PASSWORD,
  user: MYSQL_USER
})

migrate({
  sql,
  path: fileURLToPath(new URL('migrations', import.meta.url)),
  before: ({
    migration_id,
    name
  }) => {
    logger.log(`Migrating ${migration_id} ${name}`)
  },
  after: ({
    name
  }) => {
    logger.log(`✅ ${name} Migrated !`)
  }
}).then(() => logger.log('✅ All good'))
  .catch(err => {
    logger.error('Failed', err)

    process.exit(1)
  })
