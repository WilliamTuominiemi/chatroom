import React, { Component } from 'react'
import { io } from 'socket.io-client'
import { Redirect } from 'react-router-dom'

// Bootstrap
import { Card, Form, Button, FloatingLabel, Dropdown } from 'react-bootstrap'

// Socket.io
const socket = io('http://localhost:8080')

// Received
const RMessage = (props) => (
    <div className="receivedMessage">
        <Card.Text>
            <b style={{ color: `${props.message.color}` }}>{props.message.name || props.message.id}:‎‎‎‎‎⠀</b>
            {props.message.message}
        </Card.Text>
    </div>
)

// Sent
const SMessage = (props) => (
    <div className="sentMessageContainer">
        <div className="sentMessage">
            <Card.Text>
                <b>You:</b> {props.message.message}
            </Card.Text>
        </div>
    </div>
)

export default class Chat extends Component {
    constructor(props) {
        super(props)

        socket.on('connect', () => {
            console.log(`You connected with id: ${socket.id}`)
            socket.emit('join-room', this.props.match.params.id)
        })

        socket.on('receive-message', (message) => {
            const newMessages = this.state.messages.concat(message)
            this.setState({ messages: newMessages })
        })

        socket.on('invalid-room', () => {
            this.setState({ redirect: true })
        })

        this.onChangeMessage = this.onChangeMessage.bind(this)
        this.onChangeName = this.onChangeName.bind(this)
        this.onChangeColor = this.onChangeColor.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            message: '',
            messages: [],
            name: '',
            color: '#000000',
            redirect: false,
        }
    }

    onChangeMessage(e) {
        this.setState({
            message: e.target.value,
        })
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value,
        })
    }

    onChangeColor(e) {
        this.setState({
            color: e.target.value,
        })
    }

    onSubmit(e) {
        e.preventDefault()
        const message = {
            message: this.state.message,
            id: socket.id,
            name: this.state.name,
            color: this.state.color,
        }

        if (message === '') return
        socket.emit('send-message', message, this.props.match.params.id)

        const newMessages = this.state.messages.concat(message)
        this.setState({ messages: newMessages })

        this.setState({
            message: '',
        })
    }

    messagesList() {
        return this.state.messages.reverse().map((currentMessage) => {
            console.log(currentMessage.id)
            if (currentMessage.id === socket.id) {
                return <SMessage message={currentMessage} />
            } else {
                return <RMessage message={currentMessage} />
            }
        })
    }

    render() {
        if (this.state.redirect) {
            this.setState({
                redirect: false,
            })

            return <Redirect to="/" />
        }
        return (
            <Card>
                <Card.Body>
                    <Button variant="secondary" style={{ float: 'left' }} href={'/'}>
                        Back
                    </Button>
                    <Dropdown id="dropdown-menu-align-right" align="end" style={{ float: 'right' }}>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            Settings
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.ItemText>
                                <FloatingLabel label="name">
                                    <Form.Control
                                        type="text"
                                        required
                                        className="form-control"
                                        placeholder="name"
                                        value={this.state.name}
                                        onChange={this.onChangeName}
                                    />
                                </FloatingLabel>
                            </Dropdown.ItemText>

                            <Dropdown.ItemText>
                                <Form.Label htmlFor="ColorInput">color</Form.Label>
                                <Form.Control
                                    type="color"
                                    id="ColorInput"
                                    title="Choose your color"
                                    value={this.state.color}
                                    onChange={this.onChangeColor}
                                />
                            </Dropdown.ItemText>
                        </Dropdown.Menu>
                    </Dropdown>
                </Card.Body>
                <Card.Body>
                    <div className="chatField">{this.messagesList()}</div>
                </Card.Body>
                <Card.Body>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group className="mb-3" controlId="formMessage">
                            <FloatingLabel
                                controlId="floatingMessage"
                                label="message"
                                style={{ float: 'left', width: '75%' }}
                            >
                                <Form.Control
                                    type="text"
                                    required
                                    className="form-control"
                                    placeholder="message"
                                    value={this.state.message}
                                    onChange={this.onChangeMessage}
                                />
                            </FloatingLabel>
                            <Button variant="primary" type="submit" size="lg">
                                send
                            </Button>
                        </Form.Group>
                        <br />
                        <Card.Text style={{ color: `${this.state.color}` }}>
                            <b>{this.state.name || socket.id}</b>
                        </Card.Text>
                    </Form>
                </Card.Body>
            </Card>
        )
    }
}
