/* eslint-disable camelcase */
import { Console } from 'node:console'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'
import migrate from '../index.js'

const logger = new Console({ stdout: process.stdout, stderr: process.stderr })

const {
  POSTGRESQL_ADDON_USER,
  POSTGRESQL_ADDON_PASSWORD,
  POSTGRESQL_ADDON_DB
} = process.env

const HOST = `postgresql://${POSTGRESQL_ADDON_USER}:${POSTGRESQL_ADDON_PASSWORD}@127.0.0.1:5432/${POSTGRESQL_ADDON_DB}`

const sql = postgres(HOST, {
  idle_timeout: 1
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
