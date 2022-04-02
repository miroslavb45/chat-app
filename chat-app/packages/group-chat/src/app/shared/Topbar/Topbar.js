import { getAuth } from 'firebase/auth';
import React from 'react';
import { Component } from 'react';
import { connect, connectAdvanced } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

class Topbar extends Component {
  constructor() {
    super();
    this.auth = getAuth();
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.appTitle}>CHAT APP</div>
        <div className={styles.workspaceName}>{this.props.workspace.name}</div>
        <div className={styles.logout}>
          <Link to="/logout">Logout</Link>
        </div>
      </div>
    );
  }
}
const mapStateToPros = (state) => ({
  workspace: state.workspace.activeWorkspace,
});

export default connect(mapStateToPros)(Topbar);
