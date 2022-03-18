import React, { Component } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import background from 'images/background.png';
import icon from 'images/icon.png';

// import { useAuth } from "../contexts/AuthContext"

import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from './actions';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      inputErrors: false,
      username: '',
      password: '',
      passwordAgain: '',
    };
  }

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handlePasswordAgainChange = (e) => {
    this.setState({ passwordAgain: e.target.value });
  };

  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.password !== this.state.passwordAgain) {
      alert('Password mismatch!');
      return;
    }

    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, this.state.username, this.state.password);
      this.props.dispatch(registerUser({ email: this.state.username.toLowerCase() }));
    } catch (e) {
      this.setState({ inputErrors: true });
    }
  };

  render() {
    return (
      <div className={styles.mainWrapper} style={{ backgroundImage: `url(${background})` }}>
        <div className={styles.overlay}></div>

        <div className={styles.loginWrapper}>
          <div className={styles.iconWrapper}>
            <img src={icon} alt="Arrow left" />
          </div>

          <div className={styles.loginFormWrapper}>
            <div className={styles.titleWrapper}>
              <h1>Sign up to </h1>
              <h2>The simplest chat app ever made</h2>
            </div>

            <div className={styles.formWrapper}>
              <form className={styles.mLoginForm}>
                <div className={styles.inputWrapper}>
                  <label>
                    E-Mail:
                    <input onChange={this.handleUsernameChange} type="text" placeholder="Enter your e-mail" />
                  </label>
                  <label>
                    Password:
                    <input onChange={this.handlePasswordChange} type="password" placeholder="Enter your password" />
                  </label>
                  <label>
                    Password Again:
                    <input
                      onChange={this.handlePasswordAgainChange}
                      type="password"
                      placeholder="Enter your password again"
                    />
                  </label>
                </div>
                <span className={this.state.inputErrors ? styles.showError : ''}>Invalid username or password.</span>
                <input onClick={this.handleSubmit} type="submit" value="Register" />

                <div className={styles.bottomLabel}>
                  Already have an Account?{' '}
                  <Link className={styles.registerLink} to="/login">
                    Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(Register);
