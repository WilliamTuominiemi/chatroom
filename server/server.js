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
    // TODO: When user connect find all rooms and emit them to the user only 
    // using io.to(socketId).emit(/* ... */)

    console.log(socket.id)

    const loadRooms = () => {
        Room.find()
        .then((result) => {
            io.to(socket.id).emit('get-rooms', result)
        })
    }   

    socket.on("send-message", (message, room) => {
        console.log("room: "+room)
        socket.to(room).emit('receive-message', message);
    })

    socket.on("create-room", (room) => {
        console.log(room)
        const _room = new Room({
            name: room.roomName,
        })
        
        _room.save()
        .then(() => loadRooms())
        .catch(err => console.log('Error: ' + err))
    })

    socket.on("join-room", room => {
        console.log('joined room'+room)
        socket.join(room)
    })

    loadRooms()
})

