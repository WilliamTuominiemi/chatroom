const dotenv = require('dotenv')
const io = require('socket.io')(8080 ,{
    cors: {
        origin:['http://localhost:3000']
    }
})

// Load config
dotenv.config({ path: './config/.env' })

// Connect to MongoDB
const connectDB = require('./config/db')
connectDB()

// Models
const Room = require('./models/Room')

io.on('connect', socket => {
    socket.on("send-message", (message) => {
        socket.broadcast.emit('receive-message', message)
    })

    socket.on("create-room", (room) => {
        console.log(room)
        const _room = new Room({
            name: room.roomName,
        })
        
        _room.save()
        .then(() => console.log('room added'))
        .catch(err => console.log('Error: ' + err))
    })
})

