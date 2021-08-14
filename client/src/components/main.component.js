import React, { Component } from 'react'
import { io } from "socket.io-client"

// Bootstrap
import { Card, Form, Button, FloatingLabel, Dropdown } from 'react-bootstrap';

// Socket.io
const socket = io('http://localhost:8080')

export default class Main extends Component {
    constructor(props) {
        super(props)

        this.onChangeRoomName = this.onChangeRoomName.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        
        this.state = {
            roomName: '',
        }
    }

    onChangeRoomName(e) {
        this.setState({
            roomName: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault()
       
        const room = {
            "roomName": this.state.roomName,
        }

        if(room === "") return
        socket.emit('create-room', room)

        this.setState({
            roomName: ""
        })
    }
  
    render() {
    return (
        <Card>
            <Card.Title>ChatApp</Card.Title>
            <Card.Body>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Dropdown Button
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group className="mb-3" controlId="formMessage">
                            <FloatingLabel controlId="floatingMessage" label="room name" style={{margin: "10px"}}>
                                <Form.Control 
                                    type="text" 
                                    required
                                    className="form-control"
                                    placeholder="room name"
                                    value={this.state.roomName}
                                    onChange={this.onChangeRoomName}
                                />
                            </FloatingLabel>
                            <Button variant="primary" type="submit" style={{margin: "10px"}}>
                                Create room
                            </Button>
                        </Form.Group>
                    </Form>
                </Dropdown.Menu>
            </Dropdown>    
            <br/>
            <Button href="/chat">Chat</Button>
            </Card.Body>
        </Card>
    )
    }
}