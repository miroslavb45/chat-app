import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { AuthContextProvider, useAuthState } from './contexts/FirebaseContext';

import './index.scss';
import { Home } from 'scenes/Home';
import { Login } from 'scenes/Login';
import { Logout } from './scenes/Logout';
import { Register } from './scenes/Register';

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
