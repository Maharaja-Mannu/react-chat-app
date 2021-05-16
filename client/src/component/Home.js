import { useEffect, useState } from "react"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import {Link, useHistory} from 'react-router-dom'
import socket from '../socket'
import Container from "react-bootstrap/Container"

export default function Home({isUsername, setIsUsername}) {
    const [username, setUsername] = useState('')
    const [err, setErr] = useState('')
   
    const handleChange = (e) => {
        setUsername(e.target.value)
    }
    const handleUsernameSelection = (username) => {
        setIsUsername(username)
        socket.auth = { username }
        socket.connect()
    }
    let history = useHistory()

    // submit handler for form
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (username.trim().length > 1) {
            try {
                const res = await fetch('/create-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username
                    })
                })
                if (res.ok){
                    handleUsernameSelection(username)
                    history.push('/chat')
                }
            } catch (error) {
                setErr(error.message)
            }
        }else {
            setErr('Username should contain altest two character')
        }
    }

    useEffect(() => {
        socket.on("connect_error", (err) => {
            if (err.message === "invalid username") {
                // localStorage.removeItem('username')
                console.log('Invalid username')
            }
        });
        return () => {
            socket.off("connect_error")
        }
    })

    return(
        <Container className="pt-4">
            <h2>Welcome to chit-chat app</h2>
            {!isUsername ? (

                <Form onSubmit={handleSubmit}>
                    {err && <Alert variant="danger">
                            <strong>Error</strong>
                            <p>{err}</p>
                        </Alert>}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" value={username} 
                        onChange={handleChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>

            ): (
                <Link to="/chat">go to chat page</Link>
            )}
        </Container>
    )
}