import CloseIcon from '@mui/icons-material/Close';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'simple-react-modal';
import { renameWorkspaceUser, toggleProfileSettingsModal } from './actions';
import styles from './styles.module.scss';

class ProfileSettingsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputError: null,
      name: props.name,
    };
  }

  handleChannelRename = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.dispatch(
      renameWorkspaceUser({
        name: this.state.name,
      })
    );
    this.props.dispatch(toggleProfileSettingsModal());
  };

  handleChannelNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  render() {
    return (
      <Modal show={this.props.isModalOpen} onClose={() => this.props.dispatch(toggleProfileSettingsModal())}>
        <div className={styles.modalContentWrapper}>
          <div className={styles.header}>
            <h1>Change your display name</h1>
            <CloseIcon
              className={styles.closeIcon}
              onClick={() => this.props.dispatch(toggleProfileSettingsModal())}
            ></CloseIcon>
          </div>

          <div className={styles.content}>
            <div className={styles.formWrapper}>
              <form className={styles.mLoginForm}>
                <div className={styles.inputWrapper}>
                  <label>
                    New name
                    <input onChange={this.handleChannelNameChange} type="text" placeholder={this.props.name} />
                  </label>
                </div>
                <span className={this.props.error ? styles.showError : ''}>Name already taken.</span>
                <input onClick={this.handleChannelRename} type="submit" value="Rename" />

                <div className={styles.bottomLabel}></div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToPros = (state) => ({
  isModalOpen: state.user.isRenameModalOpen,
  name: state.user?.workspaceUser?.displayName,
});
export default connect(mapStateToPros)(ProfileSettingsModal);
