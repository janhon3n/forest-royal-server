const geolib = require('geolib')

class Game {
  constructor(options) {
    this.options = options
    this.hasStarted = false
    this.circle = options.circle

    this.startNewPhase = this.startNewPhase.bind(this)
    this.shrinkCircle = this.shrinkCircle.bind(this)
    this.sendStateToPlayer = this.sendStateToPlayer.bind(this)

    this.phaseInfo = {
      num: 0,
      duration: options.phaseDuration
    }

    this.players = []
  }

  start() {
    this.sendStateToPlayers("Game is starting...")
    setTimeout(() => {
      this.hasStarted = true
      this.startNewPhase()
    }, 2000)
  }

  startNewPhase() {
    this.phaseInfo = {
      num: this.phaseInfo.num + 1,
      startTime: new Date().getTime(),
      duration: this.phaseInfo.duration * 4/5,
    }
    this.shrinkCircle()
    if (this.circle.radius > 5) {
      this.circleTimer = setTimeout(this.startNewPhase, this.phaseInfo.duration * 1000 * 60)
      this.sendStateToPlayers("Get to the new area!")
    }
  }

  getPhaseInfo() {
    return this.phaseInfo
  }

  shrinkCircle() {
    let newRadius = this.circle.radius * 4/5
    let newCenter = geolib.computeDestinationPoint(
      this.circle.center,
      Math.random() * (this.circle.radius - newRadius),
      Math.random() * 360,
    )
    this.circle.radius = newRadius
    this.circle.center = newCenter
  }

  playerJoined(player) {
    player.game = this
    this.players.push(player)

    player.on('request_state', () => {
      this.sendStateToPlayer(player, null)
    })

    player.on('set_ready', (ready) => {
      player.ready = ready
      this.sendStateToPlayers(null)

      if(ready && this.players.length >= 1) {
        if (this.players.reduce((a, p) => {
          return (a && p.ready)
        }, true)) {
          this.start()
        }
      }
    })
    

    this.sendStateToPlayers("Player " + player.tag + " joined")
  }

  playerLeft(player) {
    let i = this.players.indexOf(player)
    if (i !== -1) {
      this.players.splice(i, 1)
      this.sendStateToPlayers("Player " + player.tag + " left")
    }
  }

  sendStateToPlayers(message) {
    this.players.forEach(p => {
      this.sendStateToPlayer(p, message)
    })
  }

  sendStateToPlayer(player, message) {
    player.emit('update_state', {
      message,
      circle: this.circle,
      phaseInfo: this.phaseInfo,
      hasStarted: this.hasStarted,
      players: this.players.map(p => {
          return {
            id: p.id,
            tag: p.tag,
            ready: p.ready,
          }
      })
    })
  }
}

module.exports = Game