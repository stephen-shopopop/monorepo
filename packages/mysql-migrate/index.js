/* eslint-disable camelcase */
import fs from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default async function ({
  sql,
  path = join(process.cwd(), 'migrations'),
  before = null,
  after = null
}) {
  const migrations = fs.readdirSync(path)
    .filter(x => fs.statSync(join(path, x)).isDirectory() && x.match(/^[0-9]{5}_/))
    .sort()
    .map(x => ({
      path: join(path, x),
      migration_id: parseInt(x.slice(0, 5)),
      name: x.slice(6).replace(/-/g, ' ')
    }))

  const latest = migrations[migrations.length - 1]

  if (latest.migration_id !== migrations.length) {
    throw new Error('Inconsistency in migration numbering')
  }

  await ensureMigrationsTable()

  const [current] = await getCurrentMigration()
  const needed = migrations.slice(current ? current.id : 0)

  try {
    sql.query('START TRANSACTION')

    await next(sql)

    await sql.query('COMMIT')
  } catch (error) {
    await sql.query('ROLLBACK')

    throw error
  } finally {
    await sql.destroy()
  }

  async function next (sql) {
    const current = needed.shift()
    if (!current) { return }

    before && before(current)
    await run(sql, current)
    after && after(current)

    await next(sql)
  }

  async function run (sql, {
    path,
    migration_id,
    name
  }) {
    fs.existsSync(join(path, 'index.sql')) && !fs.existsSync(join(path, 'index.mjs'))
      ? await sql.query(await readFile(join(path, 'index.sql'), { encoding: 'utf8' }))
      : await import(join(path, 'index.mjs')).then(x => x.default(sql))

    await sql.query(`
      insert into migrations (migration_id, name)
      values (${migration_id}, "${name}")
    `)
  }

  function getCurrentMigration () {
    return sql.query(`
      select migration_id as id from migrations
      order by migration_id desc
      limit 1
    `).then(([x]) => x)
  }

  function ensureMigrationsTable () {
    return sql.query(`
      create table if not exists migrations (
        migration_id serial primary key,
        created_at datetime not null default now(),
        name text
      )
    `)
  }
}
