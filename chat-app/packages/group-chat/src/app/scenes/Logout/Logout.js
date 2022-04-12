import { getAuth, signOut } from '@firebase/auth';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { unselectMainContentAction } from '../Home/actions';
import { unselectWorkspaceAction } from '../Workspace/actions';

class Logout extends Component {
  componentDidMount() {
    this.props.dispatch(unselectWorkspaceAction());
    this.props.dispatch(unselectMainContentAction());

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
