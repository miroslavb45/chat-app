import CloseIcon from '@mui/icons-material/Close';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'simple-react-modal';
import { createWorkspaceChannel } from '../../actions';
import { toggleCreateChannelModalAction } from './actions';
import styles from './styles.module.scss';

class CreateChannelModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputError: null,
      name: ''
    };
  }

  handleChannelCreation = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.dispatch(createWorkspaceChannel({
        entityId: this.props.workspace,
        name: this.state.name
    }))
  };

  handleChannelNameChange = (e) => {
    this.setState({ name: e.target.value });
  };


  render() {
    return (
      <Modal show={this.props.isModalOpen} onClose={() => this.props.dispatch(toggleCreateChannelModalAction())}>
        <div className={styles.modalContentWrapper}>
          <div className={styles.header}>
            <h1>Create Channel</h1>
            <CloseIcon
              className={styles.closeIcon}
              onClick={() => this.props.dispatch(toggleCreateChannelModalAction())}
            ></CloseIcon>
          </div>

          <div className={styles.content}>
            <div className={styles.formWrapper}>
              <form className={styles.mLoginForm}>
                <div className={styles.inputWrapper}>
                  <label>
                    Channel Name
                    <input onChange={this.handleChannelNameChange} type="text" placeholder="Enter channel name" />
                  </label>
                </div>
                <span className={this.props.error ? styles.showError : ''}>Name already taken.</span>
                <input onClick={this.handleChannelCreation} type="submit" value="Create" />

                <div className={styles.bottomLabel}>
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
  isModalOpen: state.channel.isCreateModalOpen,
  workspace: state.workspace.activeWorkspace.id,
  error: state.channel.createChannelError
});
export default connect(mapStateToPros)(CreateChannelModal);
