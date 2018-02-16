// @flow

import PostgresModel from 'db/postgres/model'

type QueryAndCreateDataType = {|
  name: string,
|}

export class ExchangesModel extends PostgresModel<
  QueryAndCreateDataType,
  QueryAndCreateDataType,
> {
  update() {
    throw new Error('not allowed')
  }
}

export default new ExchangesModel()
