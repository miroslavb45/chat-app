import React, { Component } from 'react';
import Topbar from '../Topbar';
import { getAuth } from 'firebase/auth';
import Chat from '../Chat';

export default class Home extends Component {
  state = {
    username: null,
  };
  async componentDidMount() {
    const url = 'http://api.localhost/api/hello';

    const auth = getAuth();

    const token = await auth.currentUser.getIdToken();

    const username = await await fetch(url, {
      method: 'get',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    });

    const data = await username.text();
    this.setState({ username: data });
  }
  render() {
    return (
      <div>
        <Topbar />
        Hello {this.state.username}
        <Chat />
      </div>
    );
  }
}
