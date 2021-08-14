import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// Bootstrap
import { Card, Form, Button, FloatingLabel, Dropdown } from 'react-bootstrap';

export default class PostsList extends Component {
//   constructor(props) {
//     super(props)
//   }

//   componentDidMount() {

//   }
    
  render() {
    return (
        <Card>
            <Card.Title>ChatApp</Card.Title>
            <Card.Body>
                <Button href="/chat">Chat</Button>
            </Card.Body>
        </Card>
    )
  }
}