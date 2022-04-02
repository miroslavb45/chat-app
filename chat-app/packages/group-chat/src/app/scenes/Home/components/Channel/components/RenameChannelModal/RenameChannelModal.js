import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'simple-react-modal';
import { toggleCreateChannelModalAction, toggleRenameChannelModalAction } from './actions';
import styles from './styles.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import {
  createWorkspaceChannel,
  createWorkspaceChannels,
  renameWorkspaceChannel,
  renameWorkspaceChannelSuccess,
} from '../../actions';

class RenameChannelModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputError: null,
      name: '',
    };
  }

  handleChannelRename = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.dispatch(
      renameWorkspaceChannel({
        id: this.props.channelId,
        name: this.state.name,
      })
    );
    this.props.dispatch(toggleRenameChannelModalAction());
  };

  handleChannelNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  render() {
    return (
      <Modal show={this.props.isModalOpen} onClose={() => this.props.dispatch(toggleRenameChannelModalAction())}>
        <div className={styles.modalContentWrapper}>
          <div className={styles.header}>
            <h1>Rename Channel</h1>
            <CloseIcon
              className={styles.closeIcon}
              onClick={() => this.props.dispatch(toggleRenameChannelModalAction())}
            ></CloseIcon>
          </div>

          <div className={styles.content}>
            <div className={styles.formWrapper}>
              <form className={styles.mLoginForm}>
                <div className={styles.inputWrapper}>
                  <label>
                    New channel Name
                    <input onChange={this.handleChannelNameChange} type="text" placeholder="Rename channel" />
                  </label>
                </div>
                <span className={this.props.error ? styles.showError : ''}>Name already taken.</span>
                <input onClick={this.handleChannelRename} type="submit" value="Rename" />

                <div className={styles.bottomLabel}>
                  {/* Already have one? Select a{' '}
                  <Link className={styles.registerLink} to="/workspaces">
                    Workspace */}
                  {/* </Link> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToPros = (state) => ({
  isModalOpen: state.channel.isRenameModalOpen,
  workspace: state.workspace.activeWorkspace.id,
  error: state.channel.createChannelError,
  channelId: state.channel?.activeChannel?.id,
});
export default connect(mapStateToPros)(RenameChannelModal);
