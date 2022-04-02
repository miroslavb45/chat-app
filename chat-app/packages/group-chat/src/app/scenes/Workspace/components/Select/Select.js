import React, { Component } from 'react';
import styles from './styles.module.scss';

import background from 'images/background.png';
import icon from 'images/icon.png';

import { Link } from 'react-router-dom';

import { default as InputSelect } from 'react-select';
import { connect } from 'react-redux';
import { getWorkspaces, selectWorkspaceAction } from '../../actions';

class Select extends Component {
  constructor() {
    super();
    this.state = {
      inputErrors: false,
      username: 'admin@admin.com',
      password: 'admin123',
    };
  }

  componentDidMount() {
    this.props.dispatch(getWorkspaces());
  }

  componentDidUpdate() {
    if (this.props.activeWorkspace) {
      this.props.dispatch(selectWorkspaceAction({ isActive: true }));
      console.log("WORKSPACE SELECTED")

    }
  }

  handleWorkspaceSelection = (e) => {
    this.props.dispatch(selectWorkspaceAction(e));
  };

  get options() {
    return this.props?.availableWorkspaces.map((i) => ({ value: i.id, label: i.name })) || {};
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
              <h1>Select a workspace </h1>
              <h2>The simplest chat app ever made</h2>
            </div>

            <div className={styles.formWrapper}>
              <form className={styles.mLoginForm}>
                <div className={styles.inputWrapper}>
                  <InputSelect options={this.options} onChange={this.handleWorkspaceSelection} />
                </div>
                <div className={styles.bottomLabel}>
                  Create new{' '}
                  <Link className={styles.registerLink} to="/workspaces/new">
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

export default connect(mapStateToPros)(Select);
