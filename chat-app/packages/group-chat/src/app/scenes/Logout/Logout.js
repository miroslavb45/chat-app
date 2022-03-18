import React, { Component } from 'react';
import { getAuth, signOut } from '@firebase/auth'
import { connect } from 'react-redux';
import { unselectWorkspaceAction } from '../Workspace/actions';
import { getUserInfoAction } from '../Login/actions';


class Logout extends Component {
  componentDidMount() {
    this.props.dispatch(unselectWorkspaceAction())

    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // console.log('Signed out successfully.');
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  }

  render() {
    return <div>Logout</div>;
  }
}


export default connect()(Logout);