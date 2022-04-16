import CallIcon from '@mui/icons-material/Call';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { endVideoCall, hangUpVideoCallAction, toggleAudioAction, toggleVideoAction } from '../../actions';
import CallAction from './components/CallAction/CallAction';

import styles from './styles.module.scss';

export const selfVideo = createRef();
export const partnerVideo = createRef();

class InCallModal extends Component {
  handleVideoActionClick = () => {
    this.props.dispatch(toggleVideoAction());
  };

  handleAudioActionClick = () => {
    this.props.dispatch(toggleAudioAction());
  };

  handleHangUpClick = () => {
    this.props.dispatch(hangUpVideoCallAction());
    this.props.dispatch(endVideoCall({ workspaceUserId: this.props.partnerId }));
  };

  render() {
    return this.props.isOpen ? (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.videosWrapper}>
            <div className={styles.videoWrapper}>
              <div className={styles.label}>{this.props.myName}</div>
              <video className={styles.video} ref={selfVideo} autoPlay></video>
            </div>

            <div className={styles.videoWrapper}>
              <div className={styles.label}>{this.props.partnerName}</div>
              <video className={styles.video} ref={partnerVideo} autoPlay></video>
            </div>
          </div>
          <div className={styles.controlsWrapper}>
            {this.props.isVideoOn ? (
              <CallAction onClick={this.handleVideoActionClick} icon={<VideocamIcon />}></CallAction>
            ) : (
              <CallAction disable={true} onClick={this.handleVideoActionClick} icon={<VideocamOffIcon />}></CallAction>
            )}

            {this.props.isAudioOn ? (
              <CallAction onClick={this.handleAudioActionClick} icon={<MicIcon />}></CallAction>
            ) : (
              <CallAction disable={true} onClick={this.handleAudioActionClick} icon={<MicOffIcon />}></CallAction>
            )}

            <CallAction disable={true} onClick={this.handleHangUpClick} icon={<CallIcon />}></CallAction>
          </div>
        </div>
      </div>
    ) : null;
  }
}

const mapStateToProps = (state) => ({
  isOpen: state.videoChat.isInCall,
  partnerName: state.videoChat.partnerName,
  myName: state.user.workspaceUser.displayName,
  partnerId: state.videoChat.partnerId,
  isVideoOn: state.videoChat.isVideoOn,
  isAudioOn: state.videoChat.isAudioOn,
  shouldCall: state.videoChat.shouldCall,
});

export default connect(mapStateToProps)(InCallModal);
