import React, { Component } from 'react';
import { useCallback } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

// import { useAuth } from "../contexts/AuthContext"

import styles from './styles.module.scss';

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      inputErrors: false,
      username: 'miroslavb45@gmail.com',
      password: '123456'
    };
  }

  handleChange = (event) => {
    // const passwordRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
    // this.setState({ inputErrors: !event.target.value.match(passwordRegex) });

    console.log('asd');
  };

  handlePasswordChange = e => {
      this.setState({password: e.target.value});
  }

  handleUsernameChange = e => {
    this.setState({username: e.target.value});
}

  handleSubmit = (async e => {
    e.preventDefault();
    e.stopPropagation();

    const auth = getAuth()
    try {
      await signInWithEmailAndPassword(auth, this.state.username, this.state.password)
    } catch (e) {
      alert(e.message)
    }
  });

  render() {
    return (
      <form className={styles.mLoginForm}>
        <h3>Login</h3>
        <input onChange={this.handleUsernameChange} type="text" placeholder="Username" />
        <input onChange={this.handlePasswordChange} type="password" placeholder="Password" />
        <span className={this.state.inputErrors ? styles.showError : ''}>
          Please make sure your password contains a letter, number and a special character.
        </span>
        <input onClick={this.handleSubmit} type="submit" value="Login" />
      </form>
    );
  }
}
