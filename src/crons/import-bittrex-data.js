// @flow

require('assert-env')(['CRON_INTERVAL'])

import Cron from 'crons/base'
import bittrex from 'api/bittrex'
import cryptos from 'models/cryptos'

export default new Cron(async () => {
  const foo = await bittrex.getCryptos()
  await cryptos.create(foo)
}, parseInt(process.env.CRON_INTERVAL, 10))
