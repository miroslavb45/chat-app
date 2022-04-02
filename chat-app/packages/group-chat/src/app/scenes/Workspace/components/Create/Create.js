import React, { Component } from 'react';
import styles from './styles.module.scss';

import background from 'images/background.png';
import icon from 'images/icon.png';

import { Link } from 'react-router-dom';

import { default as InputSelect } from 'react-select';
import { connect } from 'react-redux';
import { createWorkspaceAction, getWorkspaces, selectWorkspaceAction } from '../../actions';

class Create extends Component {
  constructor() {
    super();
    this.state = {
      inputErrors: false,
      name: '',
    };
  }

  handleWorkspaceCreation = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.dispatch(createWorkspaceAction(this.state.name));
  };

  handleWorkspaceNameChange = (e) => {
    this.setState({ name: e.target.value });
  };


  get options() {
    return this.props.availableWorkspaces.map((i) => ({ value: i.id, label: i.name })) || {};
  }

  render() {
    console.log(this.options);
    return (
      <div className={styles.mainWrapper} style={{ backgroundImage: `url(${background})` }}>
        <div className={styles.overlay}></div>

        <div className={styles.loginWrapper}>
          <div className={styles.iconWrapper}>
            <img src={icon} alt="Arrow left" />
          </div>

          <div className={styles.loginFormWrapper}>
            <div className={styles.titleWrapper}>
              <h1>Create a workspace </h1>
              <h2>The simplest chat app ever made</h2>
            </div>

            <div className={styles.formWrapper}>
              <form className={styles.mLoginForm}>
                <div className={styles.inputWrapper}>
                  <label>
                    Workspace Name
                    <input onChange={this.handleWorkspaceNameChange} type="text" placeholder="Enter workspace name" />
                  </label>
                </div>
                <span className={this.state.inputErrors ? styles.showError : ''}>Name already taken.</span>
                <input onClick={this.handleWorkspaceCreation} type="submit" value="Submit" />

                <div className={styles.bottomLabel}>
                  Already have one? Select a{' '}
                  <Link className={styles.registerLink} to="/workspaces">
                    Workspace
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

const mapStateToPros = (state) => ({
  availableWorkspaces: state.workspace.availableWorkspaces,
});

export default connect(mapStateToPros)(Create);
