import React, { Component } from 'react'
import { io } from "socket.io-client"

// Bootstrap
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const socket = io('http://localhost:8080')

// Received
const RMessage = props => (
    <div className="receivedMessage">
        <Card.Text><b>{props.message.id}:</b> {props.message.message}</Card.Text>
    </div>
)

// Sent
const SMessage = props => (
    <div className="sentMessageContainer">
        <div className="sentMessage">
            <Card.Text><b>You:</b> {props.message.message}</Card.Text>
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
        const message = {
            "message": this.state.message,
            "id": socket.id
        }

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
        return this.state.messages.reverse().map(currentMessage => {
            console.log(currentMessage.id)
            if(currentMessage.id === socket.id) {
                return <SMessage message={currentMessage}/>
            }   else    {
                return <RMessage message={currentMessage}/>
            }
        })
    }

    render() {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>
                        Chat
                    </Card.Title>
                </Card.Body>
                <Card.Body>
                    <div className="chatField">
                        { this.messagesList() }
                    </div>
                </Card.Body>
                <Card.Body>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group className="mb-3" controlId="formMessage">
                            <FloatingLabel controlId="floatingMessage" label="message">
                                <Form.Control 
                                    type="text" 
                                    required
                                    className="form-control"
                                    placeholder="message"
                                    value={this.state.message}
                                    onChange={this.onChangeMessage}
                                />
                            </FloatingLabel>
    
                            <Button variant="primary" type="submit">
                                send
                            </Button>
                        </Form.Group>
                    </Form>
                    {socket.id}
                </Card.Body>
            </Card>
        )
    }
}
