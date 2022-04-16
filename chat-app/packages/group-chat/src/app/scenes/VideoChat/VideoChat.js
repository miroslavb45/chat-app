import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InCallModal } from './components/InCallModal';
import IncomingCallModal from './components/IncomingCallModal/IncomingCallModal';
import { OutgoingCallModal } from './components/OutgoingCallModal';

class VideoChat extends Component {
  render() {
    return (
      <div>
        <IncomingCallModal></IncomingCallModal>
        <OutgoingCallModal></OutgoingCallModal>
        <InCallModal></InCallModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  myId: state.user.workspaceUser._id,
});

export default connect(mapStateToProps)(VideoChat);
