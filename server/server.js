const dotenv = require('dotenv')
const io = require('socket.io')(8080, {
    cors: {
        origin: ['http://localhost:3000'],
    },
})

// Load config
dotenv.config({ path: './config/.env' })

// Connect to MongoDB
const connectDB = require('./config/db')
connectDB()

// Models
const Room = require('./models/Room')

io.on('connect', (socket) => {
    const loadRooms = () => {
        Room.find().then((result) => {
            let rooms = []

            const checkAmountOfUsers = new Promise((resolve, reject) => {
                result.forEach((value, index, array) => {
                    let room = JSON.parse(JSON.stringify(value))

                    if (io.sockets.adapter.rooms.get(value._id.toString())) {
                        room.usersInRoom = io.sockets.adapter.rooms.get(value._id.toString()).size
                        rooms.push(room)
                    } else {
                        Room.findOneAndDelete({ _id: value._id }).then(() => {
                            // console.log('Deleted room')
                        })
                    }
                    if (index === array.length - 1) resolve()
                })
            })

            checkAmountOfUsers.then(() => {
                io.to(socket.id).emit('get-rooms', rooms)
            })
        })
    }

    socket.on('send-message', (message, room) => {
        console.log('room: ' + room)
        socket.to(room).emit('receive-message', message)
    })

    socket.on('create-room', (room) => {
        console.log(room)
        const _room = new Room({
            _id: room.id,
            name: room.roomName,
        })

        _room
            .save()
            .then(() => loadRooms())
            .catch((err) => console.log('Error: ' + err))
    })

    socket.on('join-room', (room) => {
        socket.join(room)
    })

    loadRooms()

    socket.on('disconnect', function () {
        loadRooms()
    })
})
