import React, { Component } from 'react';
import { getAuth, signOut } from '@firebase/auth'


export default class Logout extends Component {
  componentDidMount() {
    console.log('Sanyi');
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('Signed out successfully.');
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
