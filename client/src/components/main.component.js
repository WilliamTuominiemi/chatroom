import React, { Component } from 'react'
import { io } from 'socket.io-client'
import { Redirect } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

// Bootstrap
import { Card, Form, Button, FloatingLabel, Dropdown } from 'react-bootstrap'

// Socket.io
const socket = io('http://localhost:8080')

const Room = (props) => (
    <Card.Body>
        <div className="room">
            <Card.Title>{props.room.name}</Card.Title>
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
        super(props)
        socket.on('get-rooms', (_rooms) => {
            this.setState({ rooms: _rooms })
        })

        this.onChangeRoomName = this.onChangeRoomName.bind(this)
        this.onChangeRoomCode = this.onChangeRoomCode.bind(this)
        this.onChangeRoomPrivacy = this.onChangeRoomPrivacy.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onSubmitCode = this.onSubmitCode.bind(this)

        this.state = {
            roomName: '',
            private: false,
            rooms: [],
            redirect: false,
            redirectUrl: '',
            roomCode : '',
        }
    }

    onChangeRoomName(e) {
        this.setState({
            roomName: e.target.value,
        })
    }

    onChangeRoomPrivacy(e) {
        this.setState({
            private: true,
        })
    }

    onChangeRoomCode(e) {
        console.log(e.target.value)
        this.setState({
            roomCode: e.target.value,
        })
    }

    onSubmit(e) {
        e.preventDefault()

        const room = {
            roomName: this.state.roomName,
            private: this.state.private,
            id: uuidv4(),
        }

        if (room === '') return
        socket.emit('create-room', room)

        this.setState({
            roomName: '',
            redirect: true,
            redirectRoom: `${room.id}`,
        })
    }

    onSubmitCode(e) {
        e.preventDefault()

        const room = {
            roomCode: this.state.roomCode,
        }

        console.log(room)

        if (room === '') return
        socket.emit('join-room', room)

        this.setState({
            roomCode: '',
        })
    }

    roomsList() {
        return this.state.rooms.reverse().map((currentRoom) => {
            return <Room room={currentRoom} />
        })
    }

    render() {
        if (this.state.redirect) {
            this.setState({
                redirect: false,
            })

            const redirectUrl = `/${this.state.redirectRoom}`

            socket.emit('join-room', this.state.redirectRoom)

            return <Redirect to={redirectUrl} />
        }
        return (
            <Card>
                <br />
                <Card.Title>ChatApp</Card.Title>
                <Card.Body>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Create
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
                                        /><br />
                                        <Form.Check
                                            type={'checkbox'}
                                            label={`Private`}
                                            onChange={this.onChangeRoomPrivacy}
                                        />
                                    </FloatingLabel>
                                    <Button variant="primary" type="submit" style={{ margin: '10px' }}>
                                        Create room
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Join
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Form onSubmit={this.onSubmitCode}>
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
                                            value={this.state.roomCode}
                                            onChange={this.onChangeRoomCode}
                                        /><br />
                                    </FloatingLabel>
                                    <Button variant="primary" type="submit" style={{ margin: '10px' }}>
                                        Join room
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Dropdown.Menu>
                    </Dropdown>
                    <br />
                    {/* TODO: Needs to be run again when get-rooms is received */}
                    {this.roomsList()}
                </Card.Body>
            </Card>
        )
    }
}
