jest.unmock('db/postgres/client')

import { Client } from 'pg'

import trim from 'utils/multiline-trim'
import { PostgresClient } from 'db/postgres/client'

describe('PostgresClient Unit Tests', () => {
  it('should instantiate a client', () => {
    const client = new PostgresClient()
    expect(client).toBeInstanceOf(PostgresClient)
  })

  describe('connect', () => {
    it('should create a postgres client pool', async () => {
      const postgres = new PostgresClient()
      await postgres.connect()
      expect(postgres).toHaveProperty('pool')
      expect(postgres.pool.connect).toHaveBeenCalled()
      // I can't get "mock.instances" to work properly w/ jest
      // so this will have to do..
      expect(Client.prototype.release).toHaveBeenCalled()
    })
  })

  describe('connected', () => {
    let postgres

    beforeEach(async () => {
      postgres = new PostgresClient()
      await postgres.connect()
    })

    describe('query', () => {
      it('should query the database', async () => {
        const query = `
          INSERT INTO foo(name)
          VALUES ("name")
          RETURNING *
        `
        await postgres.query(query)
        const expectedQuery = trim(query)
        expect(postgres.pool.query).toHaveBeenCalledWith(expectedQuery)
      })
    })

    describe('disconnect', () => {
      it('should query the database', async () => {
        const pool = postgres.pool
        await postgres.disconnect()
        expect(postgres).not.toHaveProperty('pool')
        expect(pool.end).toHaveBeenCalled()
      })
    })
  })
})
