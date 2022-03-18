import React, { Component } from 'react';
import { Router, Route, Redirect } from 'react-router-dom';
import { AuthContextProvider, useAuthState } from './contexts/FirebaseContext';

import './index.scss';
import { Home } from 'scenes/Home';
import { Login } from 'scenes/Login';
import { Logout } from './scenes/Logout';
import { Register } from './scenes/Register';

import { Provider } from 'react-redux';
import configureStore from './store';
import { Workspace } from './scenes/Workspace';

import { browserHistory } from './shared/sagas/navigation/saga';


export const store = configureStore();

export const AuthenticatedRoute = ({ component: C, ...props }) => {
  const { isAuthenticated } = useAuthState();
  // console.log(`Is Authenticated: ${isAuthenticated}`);
  return (
    <Route {...props} render={(routeProps) => (isAuthenticated ? <C {...routeProps} /> : <Redirect to="/login" />)} />
  );
};

export const UnauthenticatedRoute = ({ component: C, ...props }) => {
  const { isAuthenticated } = useAuthState();
  // console.log(`UnauthenticatedRoute: ${isAuthenticated}`);
  return <Route {...props} render={(routeProps) => (!isAuthenticated ? <C {...routeProps} /> : <Redirect to="/workspaces" />)} />;
};

class app extends Component {
  render() {
    return (
      <Provider store={store}>
        <AuthContextProvider>
          <Router history={browserHistory}>
            <UnauthenticatedRoute exact path="/login" component={Login} />
            <UnauthenticatedRoute exact path="/register" component={Register} />
            <AuthenticatedRoute path="/workspaces" component={Workspace} />
            <AuthenticatedRoute path="/logout" component={Logout} />
            <AuthenticatedRoute exact path="/" component={Home} />
          </Router>
        </AuthContextProvider>
      </Provider>
    );
  }
}

export default app;
