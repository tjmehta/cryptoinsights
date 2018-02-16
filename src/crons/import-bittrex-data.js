// @flow

require('assert-env')(['CRON_INTERVAL'])

import promiseProps from 'promise-props'

import Cron from 'crons/base'
import bittrex from 'api/bittrex'
import cryptos from 'models/cryptos'
import exchanges from 'models/exchanges'

export default new Cron(async () => {
  const { currencyDataArr, exchange } = await promiseProps({
    currencyDataArr: bittrex.getCurrencies(),
    exchange: exchanges.getOrCreate({ name: 'Bittrex' }, { name: 'Bittrex' }),
  })
  await Promise.all(
    currencyDataArr.map(currencyData =>
      cryptos.getOrCreate(
        {
          exchangeId: exchange.id,
          symbol: currencyData.Currency,
        },
        {
          exchangeId: exchange.id,
          name: currencyData.CurrencyLong,
          symbol: currencyData.Currency,
        },
      ),
    ),
  )
}, parseInt(process.env.CRON_INTERVAL, 10))
