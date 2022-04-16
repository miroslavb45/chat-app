import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  endVideoCall,
  hangUpVideoCallAction, startVideoCallAction
} from '../../actions';
import styles from './styles.module.scss';

class OutgoingCallModal extends Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.dispatch(
        startVideoCallAction()
      );
    }
  }

  handleHangUp = () => {
    this.props.dispatch(hangUpVideoCallAction());
    this.props.dispatch(endVideoCall({ workspaceUserId: this.props.partnerId }));
  };

  render() {
    return this.props.isOpen ? (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.label}>outgoing call</div>

          <div className={styles.image}>
            <img src={`https://i.pravatar.cc/150?u=${this.props.partnerName}`} alt="Avatar" />
          </div>

          <div className={styles.name}>{this.props.partnerName}</div>

          <div className={styles.declineButton} onClick={this.handleHangUp}>
            decline
          </div>
        </div>
      </div>
    ) : null;
  }
}

const mapStateToProps = (state) => ({
  isOpen: state.videoChat.isOutgoingCall,
  partnerName: state.videoChat.partnerName,
  partnerId: state.videoChat.partnerId,
});

export default connect(mapStateToProps)(OutgoingCallModal);
