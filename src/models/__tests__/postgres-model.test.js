jest.unmock('pg')
jest.unmock('db/postgres/client')
jest.unmock('models/postgres-model')
jest.unmock('db/postgres/client')

import postgres from 'db/postgres/client'
import trim from 'utils/multiline-trim'

import PostgresModel from 'models/postgres-model'

describe('PostgresModel Functional Tests', () => {
  const table = 'test'

  beforeEach(async () => {
    await postgres.query(`DROP TABLE IF EXISTS ${table}`)
    await postgres.query(`
      CREATE TABLE ${table} (
        id serial PRIMARY KEY,
        name text NOT NULL
      )
    `)
  })
  afterEach(async () => {
    await postgres.query(`DROP TABLE IF EXISTS ${table}`)
    await postgres.disconnect()
  })

  describe('conditionsToString', () => {
    it('should format conditions', () => {
      const str = PostgresModel.conditionsToString({ id: 1 })
      expect(str).toEqual(trim('id = 1'))
    })
  })

  it('should instantiate a model', () => {
    const model = new PostgresModel('foo')
    expect(model).toBeInstanceOf(PostgresModel)
  })

  describe('instance methods', () => {
    describe('create', () => {
      it('should create a row', async () => {
        const model = new PostgresModel(table)
        const row = await model.create({ name: 'row_name' })
        expect(row).toEqual({
          id: 1,
          name: 'row_name',
        })
      })
    })

    describe('row exists', () => {
      let model, row

      beforeEach(async () => {
        model = new PostgresModel(table)
        row = await model.create({ name: 'row_name' })
      })

      describe('list', () => {
        it('should find rows', async () => {
          const rows = await model.list({ id: row.id })
          expect(rows).toEqual([row])
        })
      })

      describe('update', () => {
        it('should update rows', async () => {
          const newName = 'new_name'
          const rows = await model.update({ id: row.id }, { name: newName })
          const updatedRow = { ...row, name: newName }
          expect(rows).toEqual([updatedRow])
        })
      })
    })
  })
})
