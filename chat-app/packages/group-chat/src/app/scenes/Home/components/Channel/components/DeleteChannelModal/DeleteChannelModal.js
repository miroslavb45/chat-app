import CloseIcon from '@mui/icons-material/Close';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'simple-react-modal';
import { unselectMainContentAction } from '../../../../actions';
import { deleteWorkspaceChannel, renameWorkspaceChannel } from '../../actions';
import { toggleDeleteChannelModalAction, toggleRenameChannelModalAction } from './actions';
import styles from './styles.module.scss';

class DeleteChannelModal extends Component {
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

    if (this.state.name === this.props.channelName) {
      this.props.dispatch(
        deleteWorkspaceChannel({
          id: this.props.channelId,
        })
      );
      this.setState({ inputError: null });
      this.props.dispatch(toggleDeleteChannelModalAction());
      this.props.dispatch(unselectMainContentAction())
    } else {
      this.setState({ inputError: `The entered name doesn't match with the channel's name` });
    }
  };

  handleChannelNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  render() {
    return (
      <Modal show={this.props.isModalOpen} onClose={() => this.props.dispatch(toggleDeleteChannelModalAction())}>
        <div className={styles.modalContentWrapper}>
          <div className={styles.header}>
            <h1>Delete Channel</h1>
            <CloseIcon
              className={styles.closeIcon}
              onClick={() => this.props.dispatch(toggleDeleteChannelModalAction())}
            ></CloseIcon>
          </div>

          <div className={styles.content}>
            <div className={styles.formWrapper}>
              <form className={styles.mLoginForm}>
                <div className={styles.inputWrapper}>
                  <label>
                    Enter channel's name to delete it: {this.props.channelName}
                    <input onChange={this.handleChannelNameChange} type="text" placeholder="Rename channel" />
                  </label>
                </div>
                <span className={this.state.inputError ? styles.showError : ''}>{this.state.inputError}</span>
                <input onClick={this.handleChannelRename} type="submit" value="Delete" />

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
  isModalOpen: state.channel.isDeleteModalOpen,
  workspace: state.workspace.activeWorkspace.id,
  error: state.channel.createChannelError,
  channelId: state.channel?.activeChannel?.id,
  channelName: state.channel?.activeChannel?.name,
});
export default connect(mapStateToPros)(DeleteChannelModal);
