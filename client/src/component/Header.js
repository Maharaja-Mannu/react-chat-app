import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { NavLink } from "react-router-dom";
import Container from 'react-bootstrap/Container'

export default function Header({username}) {
    return(
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={NavLink} to="/">Chit-Chat</Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                    <Nav.Link as={NavLink} to="/users">Users</Nav.Link>
                    {/* <Nav.Link>{username}</Nav.Link> */}

                </Nav>
                <Navbar.Text>{username}</Navbar.Text>
            </Container>
        </Navbar>
    )
}