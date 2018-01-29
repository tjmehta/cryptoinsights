// @flow

import path from 'path'

import r2 from 'r2'
import reduce from 'object-loops/reduce'

export default class BaseClient {
  constructor(host: string) {
    this.host = host
  }
  host: string
  get: (path: string) => Promise<{}>
  post: (path: string) => Promise<{}>
  put: (path: string) => Promise<{}>
  head: (path: string) => Promise<{}>
  patch: (path: string) => Promise<{}>
  delete: (path: string) => Promise<boolean>
}

const methods = ['get', 'post', 'put', 'head', 'patch', 'delete']
Object.assign(
  BaseClient.prototype,
  methods.reduce((methods, name) => {
    methods[name] = async function(...args) {
      const [urlpath, ...rest] = args
      const url = `${this.host}${path.join('/', urlpath)}`
      return r2[name](url, ...rest)
    }
    return methods
  }, {}),
)
