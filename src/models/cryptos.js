// @flow

import PostgresModel from 'db/postgres/model'

type QueryDataType = {|
  symbol?: string,
  exchangeId: number,
|}
type CreateDataType = {|
  name: string,
  symbol: string,
  exchangeId: number,
|}

export class CryptosModel extends PostgresModel<QueryDataType, CreateDataType> {
  listByExchange(exchangeId: number) {
    return this.list({ exchangeId })
  }
  update() {
    throw new Error('not allowed')
  }
}

export default new CryptosModel()
