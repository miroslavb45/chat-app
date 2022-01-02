import React, { Component } from "react"
// import Signup from "./Signup"
// import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route,Redirect, Link  } from "react-router-dom"
// import Dashboard from "./Dashboard"
import Login from "./Login"
import Home from "./Home"
import { AuthContextProvider, useAuthState } from './contexts/FirebaseContext';
import Logout from './Logout';
// import PrivateRoute from "./PrivateRoute"
// import ForgotPassword from "./ForgotPassword"
// import UpdateProfile from "./UpdateProfile"


const AuthenticatedRoute = ({ component: C, ...props }: any) => {
  const { isAuthenticated } = useAuthState()
  console.log(`Is Authenticated: ${isAuthenticated}`)
  return (
    <Route
      {...props}
      render={routeProps =>
        isAuthenticated ? <C {...routeProps} /> : <Redirect to="/login" />
      }
    />
  )
}

const UnauthenticatedRoute = ({ component: C, ...props }: any) => {
  const { isAuthenticated } = useAuthState()
  console.log(`UnauthenticatedRoute: ${isAuthenticated}`)
  return (
    <Route
      {...props}
      render={routeProps =>
        !isAuthenticated ? <C {...routeProps} /> : <Redirect to="/" />
      }
    />
  )
}

class app extends Component {
  render() {
    return (
      <div>
    <AuthContextProvider>
      <Router>
        <div>
          <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{' '}
          <Link to="/logout">Logout</Link>
          {/* <Link to="/signup">SignUp</Link> */}
        </div>
        <AuthenticatedRoute exact path="/" component={Home} />
        {/* <UnauthenticatedRoute exact path="/signup" component={SignUp} /> */}
        <UnauthenticatedRoute exact path="/login" component={Login} />
        <AuthenticatedRoute exact path="/logout" component={Logout} />
      </Router>
    </AuthContextProvider>
      </div>
    );
  }
}

export default app;
