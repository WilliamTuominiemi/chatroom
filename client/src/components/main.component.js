import React, { Component } from 'react'
import { io } from 'socket.io-client'
import { Redirect } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { useHistory } from 'react-router-dom'

// Bootstrap
import { Card, Form, Button, FloatingLabel, Dropdown } from 'react-bootstrap'

// Socket.io
const socket = io('http://localhost:8080')

const Room = (props) => (
    <Card.Body>
        <div className="room">
            <Card.Text>{props.room.name}</Card.Text>
            <Card.Text>
                <b>{props.room.usersInRoom}</b> Chatter(s)
            </Card.Text>
            <Button variant="dark" href={props.room._id}>
                Join
            </Button>
        </div>
    </Card.Body>
)

export default class Main extends Component {
    constructor(props) {
        console.log(uuidv4())

        super(props)
        socket.on('get-rooms', (_rooms) => {
            this.setState({ rooms: _rooms })
        })

        this.onChangeRoomName = this.onChangeRoomName.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            roomName: '',
            rooms: [],
            redirect: false,
            redirectUrl: '',
        }
    }

    onChangeRoomName(e) {
        this.setState({
            roomName: e.target.value,
        })
    }

    onSubmit(e) {
        e.preventDefault()

        const room = {
            roomName: this.state.roomName,
            id: uuidv4(),
        }

        if (room === '') return
        socket.emit('create-room', room)

        this.setState({
            roomName: '',
            redirect: true,
            redirectUrl: `/${room.id}`,
        })

        // history.push(url)

        // return <Redirect to="/123" />
        // return <Redirect to={url} />
        // TODO: Redirect user to the room created
        // return <Redirect to='/roomid'  />
    }

    roomsList() {
        return this.state.rooms.reverse().map((currentRoom) => {
            // console.log(currentRoom)
            return <Room room={currentRoom} />
        })
    }

    render() {
        if (this.state.redirect) {
            this.setState({
                redirect: false,
            })

            return <Redirect to={this.state.redirectUrl} />
        }
        return (
            <Card>
                <Card.Title>ChatApp</Card.Title>
                <Card.Body>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Create a Room
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Form onSubmit={this.onSubmit}>
                                <Form.Group className="mb-3" controlId="formMessage">
                                    <FloatingLabel
                                        controlId="floatingMessage"
                                        label="room name"
                                        style={{ margin: '10px' }}
                                    >
                                        <Form.Control
                                            type="text"
                                            required
                                            className="form-control"
                                            placeholder="room name"
                                            value={this.state.roomName}
                                            onChange={this.onChangeRoomName}
                                        />
                                    </FloatingLabel>
                                    <Button variant="primary" type="submit" style={{ margin: '10px' }}>
                                        Create room
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Dropdown.Menu>
                    </Dropdown>
                    <br />
                    <Button href="/chat">Chat</Button>
                    {/* TODO: Needs to be run again when get-rooms is received */}
                    {this.roomsList()}
                </Card.Body>
            </Card>
        )
    }
}
