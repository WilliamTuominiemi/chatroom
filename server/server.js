const io = require('socket.io')(8080 ,{
    cors: {
        origin:['http://localhost:3000']
    }
})

io.on('connect', socket => {
    socket.on("send-message", (message) => {
        socket.broadcast.emit('receive-message', message)
    })

    socket.on("create-room", (room) => {
        console.log(room)
    })
})

