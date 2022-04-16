import React, { Component } from 'react';
import { connect } from 'react-redux';
import { acceptVideoCallAction, declineVideoCallAction, hangUpVideoCallAction } from '../../actions';
import styles from './styles.module.scss';



class IncomingCallModal extends Component {
  handleDecline = () => {
    this.props.dispatch(declineVideoCallAction());
    this.props.dispatch(hangUpVideoCallAction());
  }


  render() {
    return this.props.isOpen ? (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.label}>incoming call</div>

          <div className={styles.image}>
            <img src={`https://i.pravatar.cc/150?u=${this.props.partnerName}`} alt="Avatar" />
          </div>

          <div className={styles.name}>{this.props.partnerName}</div>

          <div className={styles.buttonsWrapper}>
            <div className={styles.acceptButton} onClick={() => this.props.dispatch(acceptVideoCallAction())}>
              accept
            </div>

            <div className={styles.declineButton} onClick={this.handleDecline}>
              decline
            </div>
          </div>
        </div>
      </div>
    ) : null;
  }
}

const mapStateToProps = (state) => ({
  isOpen: state.videoChat.isIncomingCall,
  partnerName: state.videoChat.partnerName,
  partnerId: state.videoChat.partnerId,
});

export default connect(mapStateToProps)(IncomingCallModal);
