// Import dependencies
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

// Socket.io server
io.on('connect', (socket) => {
    const loadRooms = () => {
        Room.find().then((result) => {
            let rooms = [] // Array to store all the individual rooms in

            const checkAmountOfUsers = new Promise((resolve, reject) => {
                result.forEach((value, index, array) => {
                    let room = JSON.parse(JSON.stringify(value))

                    if (io.sockets.adapter.rooms.get(value._id.toString())) {
                        if (!value.private) {
                            // If room is defined, get it's the number of users in it
                            room.usersInRoom = io.sockets.adapter.rooms.get(value._id.toString()).size
                            rooms.push(room)
                        }
                    } else {
                        // If the room is undefined, it has no active users
                        Room.findOneAndDelete({ _id: value._id }) // Delete empty room
                    }
                    if (index === array.length - 1) resolve()
                })
            })

            checkAmountOfUsers.then(() => {
                io.to(socket.id).emit('get-rooms', rooms) // Send the list of rooms to client
            })
        })
    }

    // Handle messages
    socket.on('send-message', (message, room) => {
        console.log('room: ' + room)
        socket.to(room).emit('receive-message', message)
    })

    // Create room
    socket.on('create-room', (room) => {
        // Define object to be saved on DB
        console.log(room.private)
        const _room = new Room({
            _id: room.id,
            name: room.roomName,
            private: room.private,
        })

        _room
            .save()
            .then(() => loadRooms())
            .catch((err) => console.log('Error: ' + err))
    })

    // Join a room
    socket.on('join-room', (room) => {
        Room.find({ _id: room }).then((result) => {
            console.log(result)
            if (result.length === 0) {
                io.to(socket.id).emit('invalid-room')
            } else {
                socket.join(room)
            }
        })
    })

    socket.on('join-private-room', (room) => {
        console.log(room)
    })

    // Load rooms
    loadRooms()

    // When user disconnects load rooms again so that user count is updated
    socket.on('disconnect', function () {
        loadRooms()
    })
})
