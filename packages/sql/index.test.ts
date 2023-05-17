import { describe, expect, test } from '@jest/globals'
import { sql } from './index'

describe('[unit] fn sql()', () => {
  test('when query then return query formatted', () => {
    // Act
    const query = sql`SELECT * 
    FROM Users`

    // Assert
    expect(query).toEqual('SELECT * FROM Users')
  })

  test('when query with subquery then return query formatted', () => {
    // Act
    const query = sql`
    SELECT * 
    FROM Users
    ${sql`LEFT JOIN metadata ON metadata.id = Users.metadata_id`}
    `

    // Assert
    expect(query).toEqual('SELECT * FROM Users LEFT JOIN metadata ON metadata.id = Users.metadata_id')
  })

  test('when query with multuple subquery then return query formatted', () => {
    // Act
    const query = sql`
    SELECT * 
    FROM Users
    ${sql`WHERE Users.id`} ${4}
    `

    // Assert
    expect(query).toEqual('SELECT * FROM Users WHERE Users.id 4')
  })

  test('when bad value format then return error', () => {
    // Assert
    expect(() => sql('test')).toThrow('Bad value format')
  })
})
