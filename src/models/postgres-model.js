// @flow
import reduce from 'object-loops/reduce'

import postgresClient from 'db/postgres/client'

export default class PostgresModel {
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
          ? `${str}${delimeter}${key} = ${this.valToString(val)}`
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
  async create(data: {}) {
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
  async list(conditions: {}) {
    const query = `
      SELECT *
      FROM ${this.table}
      WHERE
        ${PostgresModel.conditionsToString(conditions)}
    `
    const result = await postgresClient.query(query)
    return result.rows
  }
  async update(conditions: {}, update: {}) {
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
