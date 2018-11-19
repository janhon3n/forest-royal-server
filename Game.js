const geolib = require('geolib')

export default class Game {
  constructor(code, options) {
    this.code = code
    this.options = options

    this.circle = {
      position: options.area.center,
      radius: options.area.radius,
    }
  }

  start() {
    startNewPhase()
  }

  startNewPhase() {
    this.phaseInfo = {
      startTime: new Date().getTime(),
      duration: this.options.phaseDuration,
    }
    shrinkCircle()
    this.circleTimer = this.setTimeout(this.startNewPhase, options.circleTime)
  }

  getPhaseInfo() {
    return this.phaseInfo
  }

  shrinkCircle() {
    let newRadius = this.circle.radius * this.options.circleShrinkRatio
    let newCenter = geolib.computeDestinationPoint(
      this.circle.center,
      Math.random() * (this.circle.radius - newRadius),
      Math.random() * 360,
    )
    this.circle.radius = newRadius
    this.circle.center = newPosition
  }
}
