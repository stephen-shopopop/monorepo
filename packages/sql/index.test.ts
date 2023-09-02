import { describe, expect, test } from '@jest/globals'
import { sql } from './index'

describe('[unit] fn sql()', () => {
  test('when query then return query formatted', () => {
    // Act
    const query = sql`SELECT * 
    FROM users`

    // Assert
    expect(query).toEqual('SELECT * FROM users')
  })

  test('when query with subquery then return query formatted', () => {
    // Act
    const query = sql`
    SELECT * 
    FROM users
    ${sql`LEFT JOIN metadata ON metadata.id = users.metadata_id`}
    `

    // Assert
    expect(query).toEqual('SELECT * FROM users LEFT JOIN metadata ON metadata.id = users.metadata_id')
  })

  test('when query with multuple subquery then return query formatted', () => {
    // Act
    const query = sql`
    SELECT * 
    FROM users
    ${sql`WHERE users.id`} = ${4}
    AND users.done = ${true}
    `

    // Assert
    expect(query).toEqual('SELECT * FROM users WHERE users.id = 4 AND users.done = true')
  })
})
