import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import background from 'images/background.png';
import icon from 'images/icon.png';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      inputErrors: false,
      username: 'admin@admin.com',
      password: 'admin123',
    };
  }

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, this.state.username, this.state.password);
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
              <h1>Sign in to </h1>
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
                </div>
                <span className={this.state.inputErrors ? styles.showError : ''}>Invalid username or password.</span>
                <input onClick={this.handleSubmit} type="submit" value="Login" />

                <div className={styles.bottomLabel}>
                  Don't have an Account?{' '}
                  <Link className={styles.registerLink} to="/register">
                    Register
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

export default connect()(Login);
