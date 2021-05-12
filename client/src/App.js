import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import Home from './component/Home'
import Header from './component/Header'
import Users from "./component/Users";
import Chat from './component/Chat'
import { useState } from 'react';

function App() {
  const [isUsername, setIsUsername] = useState(null)
  return (
    <Router>
      <div>
        <Header username={isUsername}/>
          <Switch>
            <Route exact path="/users">
              <Users />
            </Route>
            <PrivateRoute path="/chat">
              <Chat/>
            </PrivateRoute>
            <Route exact path="/">
              <Home setIsUsername={setIsUsername}/>
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
