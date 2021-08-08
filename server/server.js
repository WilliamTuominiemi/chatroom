const io = require('socket.io')(3000)

io.on('connect', socket => {
    console.log(socket.id)
})

