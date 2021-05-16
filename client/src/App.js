import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import Home from './component/Home'
import Header from './component/Header'
import Users from "./component/Users";
import Chat from './component/Chat'
import socket from './socket'

function App() {
  const [isUsername, setIsUsername] = useState(null)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

 
  useEffect(() => {
    socket.on("users", (users) => {
      users.forEach((user) => {
        user.self = user.userID === socket.id // not good for react
      });
      // sort the users by username
      let newUsers = users.sort((a, b) => {
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setUsers(newUsers)
    });

    socket.on("user connected", (user) => {
      setUsers(users => [...users, user])
    });

    socket.on("user disconnected", (id) => {
      const newData = users.map(user => user.userID === id ? { ...user, connected: false } : user)
      setUsers(newData)
    });

    socket.on("private message", ({ content, from, to }) => {

      const newData = users.map(user => {
        const fromSelf = socket.id === from
        if (user.userID === (fromSelf ? to : from)) {
          return ({ ...user, messages: [...user.messages, { content, fromSelf }], hasNewMessages: true })
        } else {
          return user
        }
      })
      setUsers(newData)
    });

    return () => {
      socket.off('users');
      socket.off('user connected');
      socket.off('user disconnected')
      socket.off('private message');
    };
  })

  return (
    <Router>
      <div>
        <Header username={isUsername}/>
          <Switch>
            <Route exact path="/users">
              <Users />
            </Route>
            <PrivateRoute path="/chat">
              <Chat users={users} setUsers={setUsers} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            </PrivateRoute>
            <Route exact path="/">
              <Home isUsername={isUsername} setIsUsername={setIsUsername}/>
            </Route>
          </Switch>
      </div>
    </Router>
  )

  function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          isUsername ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }
}

export default App;
