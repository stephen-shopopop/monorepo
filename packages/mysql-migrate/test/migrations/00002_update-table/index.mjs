export default async function (sql) {
  await sql`
    alter table test add column name text
  `

  await sql`
    insert into test (id, meta, name) values (1, "test", "me")
  `
}
