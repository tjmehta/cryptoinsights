// @flow
require('assert-env')([
  'PGDATABASE',
  'PGHOST',
  'PGPORT',
  'PGUSER',
  'PGPASSWORD',
])

import Pg from 'pg'
import { Pool } from 'pg'

import PostgresError from 'db/postgres/error'
import trim from 'utils/multiline-trim'

type PoolOptsType = {
  database: string,
  host: string,
  port: string,
  user: string,
  password: string,
}

export class PostgresClient {
  pool: Pool
  async connect(): Promise<Pool> {
    if (!this.pool) {
      this.pool = new Pool({
        database: process.env.PGDATABASE,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
      })
    }
    return this.pool
  }
  async disconnect(): Promise<void> {
    if (!this.pool) return
    const pool = this.pool
    delete this.pool
    await pool.end()
  }
  async query(query: string): Promise<any> {
    query = trim(query)
    let result
    try {
      const pool = await this.connect()
      console.log('QUERY:\n%s', query)
      result = await pool.query(query)
    } catch (err) {
      console.error('ERROR %o', err)
      throw new PostgresError(err)
    }
    // console.log('RESULT:\n%o', result)
    return result
  }
}

export default new PostgresClient()
