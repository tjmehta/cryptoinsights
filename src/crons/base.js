// @flow

import exists from '101/exists'

export default class Cron {
  constructor(job: function, intervalTime: number) {
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
    if (exists(this.intervalId)) return console.warn('cron already running!')
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
    if (!exists(this.intervalId)) return console.warn('cron already stopped!')
    clearInterval(this.intervalId)

  }
}