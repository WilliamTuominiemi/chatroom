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

    // console.log(socket.id)

    const loadRooms = () => {
        // console.log("Load rooms")
        Room.find()
        .then((result) => {
            const checkAmountOfUsers = new Promise((resolve, reject) => {
                result.forEach((value, index, array) => {
                    // console.log(value._id.toString());
                    // console.log(io.sockets.adapter.rooms.get(value._id.toString()))
                    if(io.sockets.adapter.rooms.get(value._id.toString())) {
                        // console.log(io.sockets.adapter.rooms.get(value._id.toString()).size)
                        result[index].usersOnline = io.sockets.adapter.rooms.get(value._id.toString()).size
                    } else {
                        // console.log('unPOG') 
                        result[index].usersOnline = 0
                        console.log(result[index])
                    }

                    // result[index].usersOnline = io.sockets.adapter.rooms.get(result[index]._id).size
                    if (index === array.length -1) resolve();
                });
            });
            
            checkAmountOfUsers.then(() => {
                // console.log(result)
                io.to(socket.id).emit('get-rooms', result)
            });
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
        // console.log('joined room'+room)
        socket.join(room)
        // console.log(room)
        // console.log(io.sockets.adapter.rooms.get(room).size)
    })

    loadRooms()
})

