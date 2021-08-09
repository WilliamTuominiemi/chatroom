import { io } from "socket.io-client"

const messageInput = document.getElementById("message-input")
const form = document.getElementById("form")

const socket = io('http://localhost:3000')
socket.on('connect', () => {
    displayMessage(`You connected with id: ${socket.id}`)
})

socket.on('receive-message', message => {
    displayMessage(message)
})

form.addEventListener("submit", e => {
    e.preventDefault()
    const message = messageInput.value

    if(message === "") return
    displayMessage(message)
    socket.emit('send-message', message)

    messageInput.value = ""
})

function displayMessage(message) {
    const div = document.createElement("div")
    div.textContent = message
    document.getElementById("message-container").append(div)
}