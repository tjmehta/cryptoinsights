// @flow

import errToJSON from 'error-to-json'
import map from 'object-loops/map'

import HttpClient from './http'
import HttpError from './http-error'

export class Bittrex extends HttpClient {
  constructor() {
    const version = 'v1.1'
    const host = `https://bittrex.com/api/${version}`
    super(host)
    this.version = version
  }
  version: string
  get: (
    path: string,
  ) => Promise<{
    success: boolean,
    message: string,
    result: {},
  }>
  getMarkets: () => Promise<
    Array<{
      MarketCurrency: string,
      BaseCurrency: string,
      MarketCurrencyLong: string,
      BaseCurrencyLong: string,
      MinTradeSize: number,
      MarketName: string,
      IsActive: boolean,
      Created: string,
    }>,
  >
  getCurrencies: () => Promise<
    Array<{
      Currency: string,
      CurrencyLong: string,
      MinConfirmation: number,
      TxFee: number,
      IsActive: boolean,
      CoinType: string,
      // BaseAddress : null
    }>,
  >
  getTicker: ({ market: string }) => Promise<{
    Bid: number,
    Ask: number,
    Last: number,
  }>
  getSummaries: () => Promise<
    Array<{
      MarketName: string,
      High: number,
      Low: number,
      Volume: number,
      Last: number,
      BaseVolume: number,
      TimeStamp: string,
      Bid: number,
      Ask: number,
      OpenBuyOrders: number,
      OpenSellOrders: number,
      PrevDay: number,
      Created: string,
      // "DisplayMarketName": null
    }>,
  >
  getSummary: ({ market: string }) => Promise<{
    MarketName: string,
    High: number,
    Low: number,
    Volume: number,
    Last: number,
    BaseVolume: number,
    TimeStamp: string,
    Bid: number,
    Ask: number,
    OpenBuyOrders: number,
    OpenSellOrders: number,
    PrevDay: number,
    Created: string,
    // "DisplayMarketName": null
  }>
  getMarketHistory: () => Promise<
    Array<{
      Id: number,
      TimeStamp: string, //"2014-07-09T03:21:20.08"
      Quantity: number,
      Price: number,
      Total: number,
      FillType: 'FILL' | 'PARTIAL_FILL',
      OrderType: string | 'BUY',
    }>,
  >
}

const apiPaths = {
  getMarkets: 'public/getmarkets',
  getCurrencies: 'public/getcurrencies',
  getTicker: 'public/getticker', // market
  getSummaries: 'public/getmarketsummaries',
  getSummary: 'public/getmarketsummary', // market
  getMarketHistory: 'public/getmarkethistory', // market
}

Object.assign(
  Bittrex.prototype,
  map(apiPaths, path => {
    return async function(query) {
      const res = await this.get(path, query)
      const body = await res.json()
      if (!body.success) {
        throw new HttpError(res.status, body.message, { body })
      }
      return body.result
    }
  }),
)

export default new Bittrex()
