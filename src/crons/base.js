// @flow

export default class Cron {
  constructor(job: Function, intervalTime: number) {
    this.currentJob = null
    this.intervalId = null
    this.intervalTime = intervalTime
    this.job = job
    this.start()
  }
  currentJob: ?Promise<any>
  intervalTime: number
  intervalId: ?IntervalID
  job: Function
  start() {
    if (this.intervalId != null) return console.warn('cron already running!')
    // start interval
    this.intervalId = setInterval(() => this.runJob(), this.intervalTime)
    // call immediately
    this.runJob()
  }
  async runJob() {
    try {
      await this.job()
    } catch (err) {
      console.error(err)
    }
  }
  stop() {
    if (this.intervalId == null) return console.warn('cron already stopped!')
    clearInterval(this.intervalId)
    this.intervalId = null
  }
}
