const io = require('socket.io')()
const Game = require('./Game')

const games = {}

const createCode = () => {
  let code = parseInt(Math.random() * 900000 + 10000)
  while (Object.keys(games).indexOf(code) !== -1) {
    code = parseInt(Math.random() * 900000 + 10000)
  }
  return code
}

io.on('connection', (player) => {
  player.tag = player.id
  console.log('New player ' + player.tag)

  player.getRoom = () => {
    return player.rooms[Object.keys(player.rooms)[0]]
  }

  player.on('create_game', (options, callback) => {
    let code = createCode()
    games[code] = new Game(options)
    callback(code)
  })

  player.on('join_game', (code, cb) => {
    // leave other game
    if (player.game) player.game.playerLeft(player)

    if (!games[code].hasStarted) {
      games[code].playerJoined(player)
      cb()
    }
  })

  player.on('disconnect', () => {
    console.log('Player ' + player.tag + ' has disconnected')
    if (player.game) player.game.playerLeft(player)
  })
})
console.log(io.sockets.adapter.rooms)

let port = 3001
io.listen(port)
console.log('Forest Royal server running on port ' + port)
