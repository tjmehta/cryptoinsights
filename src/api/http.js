// @flow

import path from 'path'

import r2 from 'r2'
import reduce from 'object-loops/reduce'

import HttpError from 'api/http-error'

export default class BaseClient {
  constructor(host: string) {
    this.host = host
  }
  host: string
  get: (path: string) => Promise<any>
  post: (path: string) => Promise<any>
  put: (path: string) => Promise<any>
  head: (path: string) => Promise<any>
  patch: (path: string) => Promise<any>
  delete: (path: string) => Promise<boolean>
}

const methods = ['get', 'post', 'put', 'head', 'patch', 'delete']
Object.assign(
  BaseClient.prototype,
  methods.reduce((methods, name) => {
    methods[name] = async function(...args) {
      const [urlpath, ...rest] = args
      const url = `${this.host}${path.join('/', urlpath)}`

      let res
      const promise = r2[name](url, ...rest)
      try {
        res = await promise
      } catch (err) {
        throw new HttpError(504, 'http error', { err: err })
      }
      // check for errors
      const body = await res.json()
      if (res.status === 500) {
        throw new HttpError(502, body.message, { body })
      }
      if (res.status > 500 || res.status >= 400) {
        throw new HttpError(res.status, body.message, { body })
      }
      if (res.status >= 300) {
        throw new HttpError(res.status, 'unexpected redirect', { body })
      }
      // success, return promise
      return res
    }
    return methods
  }, {}),
)
