import CloseIcon from '@mui/icons-material/Close';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'simple-react-modal';
import { unselectMainContentAction } from '../../../../actions';
import { deletePrivateMessaging } from '../../actions';
import { toggleDeleteMessagingModalAction } from './actions';
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

    if (this.state.name === this.props.partnerName) {
      this.props.dispatch(
        deletePrivateMessaging({
          entityId: this.props.partnerId,
        })
      );
      this.setState({ inputError: null });
      this.props.dispatch(toggleDeleteMessagingModalAction());
      this.props.dispatch(unselectMainContentAction());
    } else {
      this.setState({ inputError: `The entered name doesn't match with the channel's name` });
    }
  };

  handleChannelNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  render() {
    return (
      <Modal show={this.props.isModalOpen} onClose={() => this.props.dispatch(toggleDeleteMessagingModalAction())}>
        <div className={styles.modalContentWrapper}>
          <div className={styles.header}>
            <h1>Delete Conversation</h1>
            <CloseIcon
              className={styles.closeIcon}
              onClick={() => this.props.dispatch(toggleDeleteMessagingModalAction())}
            ></CloseIcon>
          </div>

          <div className={styles.content}>
            <div className={styles.formWrapper}>
              <form className={styles.mLoginForm}>
                <div className={styles.inputWrapper}>
                  <label>
                    Enter partner's name to delete it: {this.props.partnerName}
                    <input onChange={this.handleChannelNameChange} type="text" placeholder="Rename channel" />
                  </label>
                </div>
                <span className={this.state.inputError ? styles.showError : ''}>{this.state.inputError}</span>
                <input onClick={this.handleChannelRename} type="submit" value="Delete" />

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
  isModalOpen: state.messaging.isDeleteModalOpen,
  error: state.channel.createChannelError,
  partnerName: state.messaging?.activeMessaging?.name,
  partnerId: state.messaging?.activeMessaging?.id,
});
export default connect(mapStateToPros)(DeleteChannelModal);
