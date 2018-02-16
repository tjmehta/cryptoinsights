// @flow
import snakeCase from 'snake-case'
import reduce from 'object-loops/reduce'

import postgresClient from 'db/postgres/client'

export default class PostgresModel<
  QueryDataType = {},
  CreateDataType = {},
  UpdateQueryDataType = {},
  UpdateDataType = {},
> {
  constructor(table?: string) {
    this.table =
      table || this.constructor.name.replace(/Model$/, '').toLowerCase()
  }
  table: string
  static valToString(val: any) {
    return JSON.stringify(val)
      .replace(/^"/, "'")
      .replace(/"$/, "'")
  }
  static objToString(obj: {}, delimeter: string) {
    return reduce(
      obj,
      (str, val, key) => {
        return str
          ? `${str}${delimeter}${snakeCase(key)} = ${this.valToString(val)}`
          : `${key} = ${this.valToString(val)}`
      },
      '',
    )
  }
  static conditionsToString(conditions: {}) {
    return this.objToString(conditions, '\n  AND ')
  }
  static updateToString(update: {}) {
    return this.objToString(update, '\n,  ')
  }
  async create(data: CreateDataType & {}) {
    const keys = Object.keys(data)
    const keysStr = keys.toString()
    const valsStr = keys
      .map(key => JSON.stringify(data[key]).replace(/"/g, "'"))
      .toString()
    const query = `
      INSERT INTO ${this.table}(${keysStr})
      VALUES (${valsStr})
      RETURNING *
    `
    const result = await postgresClient.query(query)
    return result.rows[0]
  }
  async get(conditions: QueryDataType & {}) {
    const results = await this.list(conditions)
    return results[0]
  }
  async getOrCreate(conditions: QueryDataType & {}, data: CreateDataType & {}) {
    const result = await this.get(conditions)
    if (result) return result
    return await this.create(data)
  }
  async list(conditions: QueryDataType & {}) {
    const query = `
      SELECT *
      FROM ${this.table}
      WHERE
        ${PostgresModel.conditionsToString(conditions)}
    `
    const result = await postgresClient.query(query)
    return result.rows
  }
  async update(
    conditions: UpdateQueryDataType & {},
    update: UpdateDataType & {},
  ) {
    const query = `
      UPDATE ${this.table}
      SET
        ${PostgresModel.updateToString(update)}
      WHERE
        ${PostgresModel.conditionsToString(conditions)}
      RETURNING *
    `
    const result = await postgresClient.query(query)
    return result.rows
  }
  async remove() {}
}
