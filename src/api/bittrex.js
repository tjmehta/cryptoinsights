// @flow

import map from 'object-loops/map'

import HttpClient from './http'

export class Bittrex extends HttpClient {
  constructor() {
    const version = 'v1.1'
    const host = `https://bittrex.com/api/${version}`
    super(host)
    this.version = version
  }
  version: string
  getMarkets: () => Promise<{}>
  getCurrencies: () => Promise<{}>
  getTicker: () => Promise<{}>
  getSummaries: () => Promise<{}>
  getSummary: () => Promise<{}>
  getMarketHistory: () => Promise<{}>
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
      return await this.get(path, query)
    }
  }),
)

export default new Bittrex()
