import FaceIcon from '@mui/icons-material/Face';
import LogoutIcon from '@mui/icons-material/Logout';
import { getAuth } from 'firebase/auth';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleProfileSettingsModal } from '../../scenes/Home/components/ProfileSettingsModal/actions';
import { navigateToAction } from '../sagas/navigation/actions';
import { Dropdown } from './components/Dropdown/Dropdown';
import { DropdownItem } from './components/DropdownItem';
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
          <Dropdown name={this.props.me}>
            <DropdownItem
              icon={<FaceIcon />}
              label="profile settings"
              onClick={() => this.props.dispatch(toggleProfileSettingsModal())}
            />
            <DropdownItem
              icon={<LogoutIcon />}
              label="Logout"
              onClick={() => this.props.dispatch(navigateToAction('/logout'))}
            />
          </Dropdown>
        </div>
      </div>
    );
  }
}
const mapStateToPros = (state) => ({
  workspace: state.workspace.activeWorkspace,
  me: state.user.workspaceUser.displayName,
});

export default connect(mapStateToPros)(Topbar);
