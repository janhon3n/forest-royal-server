const io = require('socket.io')();

let createCode = () => {
    return parseInt(Math.random() * 900000 + 10000)
}


io.on('connection', (client) => {
    console.log("New client " + client.id)

    client.on('create_game', (options) => {
        client.join(createCode())
        let room = client.rooms[0]
        room.game = new Game(options)
    })

    client.on('join_game', (code) => {
        console.log(io.sockets.adapter.rooms)
    })

    client.on('disconnect', () => {
        console.log("Client " + client.id + " has disconnected")
    })
})
console.log(io.sockets.adapter.rooms)

let port = 3001
io.listen(port)
console.log("Forest Royal server running on port " + port)