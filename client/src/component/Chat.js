import React, { useState } from 'react';
import socket from '../socket'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import MessagePanel from './MessagePanel'

function Chat({users, setUsers, selectedUser, setSelectedUser}) {
    const [textMsg, setTextMsg] = useState('')

    const handleChange = (e) => {
        setTextMsg(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        sendMessage(textMsg.trim())
        setTextMsg('')
    }

    const sendMessage = (content) => {
        if (selectedUser) {
            socket.emit("private message", {
                content,
                to: selectedUser.userID,
            });
            setUsers(users => users.map(user => 
                user.userID === selectedUser.userID ?
                {...user, messages: [...user.messages, {content, fromSelf: true}]}: user))
        }
    }
    
    const handleSelect = (id) => {
        setSelectedUser(users.find(user => user.userID === id))
    }
    
    return (
        <Container>
            <Row>
                <Col xs={12} sm={4} lg={2} className="pt-3">
                    {users.length > 0 && users.map((user, index) => !user.self && (
                        <div key={index} onClick={() => handleSelect(user.userID)}>
                            <b>{user.username}</b>
                            <p>{user.connected ? 
                                <small className="text-success">Online</small> :<small>Offline</small>}
                            </p>    
                        </div>
                        )
                    )}
                </Col>
                <Col xs={12} sm={8} lg={10} className="p-3">
                    {selectedUser ? 
                        <>
                            <MessagePanel users={users} selectedUser={selectedUser} />
                            <Form onSubmit={handleSubmit} className="msg-form">
                                <Form.Group>
                                    <Form.Control as={"textarea"} row={3} value={textMsg} onChange={handleChange} placeholder="Your message" />
                                </Form.Group>
                                <Button type="submit">Send</Button>
                            </Form>
                        </> :
                        <p>Welcome<br/> Choose friend or Let someone to join</p>
                    }
                </Col>
            </Row>
        </Container>
    );
}

export default Chat;

