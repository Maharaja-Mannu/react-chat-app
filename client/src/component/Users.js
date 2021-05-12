import { useEffect, useState } from "react"
import Container from "react-bootstrap/esm/Container"

export default function  Users() {
    const [isLoading, setIsLoading] = useState(false)
    const [users, setUsers] = useState([])
    useEffect(() => {
        const loadUsers = async () => {
            setIsLoading(true)
            try {
                const res = await fetch('/users')
                if (res.ok) {
                    const data = await res.json()
                    setUsers(data.users)
                    setIsLoading(false)
                }
            } catch (error) {
                setIsLoading(false)
                console.log(error.message)
            }
        }
        loadUsers()
    }, [])
    console.log(users)
    return(
        <Container>
            <h2>Users</h2>
            {isLoading && <p className="text-info">Loading...</p>}
            <ul className="bg-light">
                {users && users.map((user, index) => {
                    return <li key={index}>{user}</li>
                })}

            </ul>
        </Container>
    )
}