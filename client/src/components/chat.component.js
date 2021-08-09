import React, { Component } from 'react'
import { io } from "socket.io-client"

const socket = io('http://localhost:8080')

const Message = props => (
    <div className="card">
      <div className="card-body">
        <p className="card-text">{props.message}</p>
      </div>
    </div>
)
  
export default class Chat extends Component {
    
    constructor(props) {
        super(props)

        socket.on('connect', () => {
            console.log(`You connected with id: ${socket.id}`)
        })

        socket.on('receive-message', message => {
            const newMessages = this.state.messages.concat(message)
            this.setState({ messages: newMessages })
            console.log(newMessages)
        })

        this.onChangeMessage = this.onChangeMessage.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        
        this.state = {
          message: '',
          messages: []
        }
    }

    onChangeMessage(e) {
        this.setState({
            message: e.target.value
        })
    }
    

    onSubmit(e) {
        e.preventDefault()
        const message = this.state.message

        if(message === "") return
        socket.emit('send-message', message)

        const newMessages = this.state.messages.concat(message)
        this.setState({ messages: newMessages })
        console.log(newMessages)

        this.setState({
            message: ""
        })
    }

    messagesList() {
        return this.state.messages.map(currentMessage => {
          return <Message message={currentMessage}/>
        })
    }

    render() {
        return (
          <div>
            { this.messagesList() }

            <div className="card" id="message-container"></div>
            <div className="card">
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>Message: </label>
                        <input  type="text"
                            required
                            className="form-control"
                            value={this.state.message}
                            onChange={this.onChangeMessage}
                            />
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Create Post" className="btn btn-primary" />
                    </div>
                </form>
            </div>
            
          </div>
        )
    }
}
