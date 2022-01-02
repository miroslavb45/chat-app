import React, { Component } from 'react';
// import Signup from "./Signup"
// import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Route, Redirect, Link } from 'react-router-dom';
// import Dashboard from "./Dashboard"
import Login from './Login';
import Home from './Home';
import { AuthContextProvider, useAuthState } from './contexts/FirebaseContext';
import Logout from './Logout';
import Topbar from './Topbar';
import Register from './Register';

import './index.scss';

// import PrivateRoute from "./PrivateRoute"
// import ForgotPassword from "./ForgotPassword"
// import UpdateProfile from "./UpdateProfile"

const AuthenticatedRoute = ({ component: C, ...props }) => {
  const { isAuthenticated } = useAuthState();
  console.log(`Is Authenticated: ${isAuthenticated}`);
  return (
    <Route {...props} render={(routeProps) => (isAuthenticated ? <C {...routeProps} /> : <Redirect to="/login" />)} />
  );
};

const UnauthenticatedRoute = ({ component: C, ...props }) => {
  const { isAuthenticated } = useAuthState();
  console.log(`UnauthenticatedRoute: ${isAuthenticated}`);
  return <Route {...props} render={(routeProps) => (!isAuthenticated ? <C {...routeProps} /> : <Redirect to="/" />)} />;
};

class app extends Component {
  render() {
    return (
      <div>
        <AuthContextProvider>
          <Router>
            <UnauthenticatedRoute exact path="/login" component={Login} />
            <UnauthenticatedRoute exact path="/register" component={Register} />
            <AuthenticatedRoute exact path="/" component={Home} />
            <AuthenticatedRoute path="/logout" component={Logout} />
            {/* <UnauthenticatedRoute exact path="/signup" component={SignUp} /> */}
          </Router>
        </AuthContextProvider>
      </div>
    );
  }
}

export default app;
