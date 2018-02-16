export default class HttpError extends Error {
  status: number
  isRetryable: boolean
  data: {}
  constructor(status: number, message: string, data: {}) {
    super(message)
    this.status = status
    this.data = data
    if (status >= 500) {
      this.isRetryable = true
    }
  }
}
