import Pg from 'pg'
import PgError from 'pg-error'

Pg.Connection.prototype.parseE = PgError.parse
Pg.Connection.prototype.parseN = PgError.parse

const Error = global.Error

type PgErrorType = {
  message: ?string,
  severity: ?string,
  code: ?string,
  condition: ?string,
  detail: ?string,
  hint: ?string,
  position: ?string,
  internalPosition: ?string,
  internalQuery: ?string,
  where: ?string,
  schema: ?string,
  table: ?string,
  column: ?string,
  dataType: ?string,
  constraint: ?string,
  file: ?string,
  line: ?string,
  routine: ?string,
}

export default class PostgresError extends Error {
  constructor(pgerr: PgErrorType) {
    super(pgerr.message)
    const keys = [
      'message',
      'severity',
      'code',
      'condition',
      'detail',
      'hint',
      'position',
      'internalPosition',
      'internalQuery',
      'where',
      'schema',
      'table',
      'column',
      'dataType',
      'constraint',
      'file',
      'line',
      'routine',
    ]
    keys.forEach(key => {
      let val
      if (key in pgerr) {
        this[key] = pgerr[key]
      }
    })
    if (pgerr.code === '42601') {
      // syntax error WHERE .. AND
      this.status = 500
    }
  }
  message: ?string
  severity: ?string
  code: ?string
  status: ?number
  condition: ?string
  detail: ?string
  hint: ?string
  position: ?string
  internalPosition: ?string
  internalQuery: ?string
  where: ?string
  schema: ?string
  table: ?string
  column: ?string
  dataType: ?string
  constraint: ?string
  file: ?string
  line: ?string
  routine: ?string
}
