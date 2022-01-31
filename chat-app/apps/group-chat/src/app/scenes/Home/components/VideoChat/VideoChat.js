import { getAuth } from 'firebase/auth';
import React, { Component, createRef } from 'react';
import { io } from 'socket.io-client';
import Peer from 'peerjs';

import styles from './styles.module.scss';

import cn from 'classnames';

export default class VideoChat extends Component {
  constructor(props) {
    super(props);
    this.peerId = `${getAuth().currentUser.email.split('@')[0]}`;

    console.log(this.peerId);

    
    // this.peer = new Peer(this.peerId, {
    //   config: {
    //     iceServers: [{ url: 'stun:stun.l.google.com:19302' }],
    //   },
    //   host: 'pjss.herokuapp.com',
    //   port: 443,
    //   path: '/myapp',
    //   secure: true,
    // });

    this.state = {
      peerId: this.peerId,
      shouldShow: false,
      connectionState: null,
      connection: null,
    };
  }

  userVideoRef = createRef();
  partnerVideoRef = createRef();

  componentDidMount() {
    navigator.getUserMedia =
      navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  }

  componentDidUpdate(prevProps, props){
      if(prevProps.partnerPeerId !== props.partnerPeerId){
          this.handleConnect();
      }
  }

  getMedia(options, success, error) {
    navigator.getUserMedia(options, success, error);
  }

  onReceiveCall(call) {
    this.getMedia(
      { audio: true, video: true },
      (stream) => {
        console.log('answering..');

        call.answer(stream);
        this.setState({ connectionState: 'inCall' });
      },
      (err) => console.log(err)
    );

    call.on('stream', (stream) => {
      console.log('Stream recivied');
      var video = this.partnerVideoRef.current;
      video.srcObject = stream;
    });
  }

  prepareSelfVideo = () => {
    this.getMedia(
      { audio: false, video: true },
      (stream) => {
        var video = this.userVideoRef.current;
        video.srcObject = stream;
      },
      (err) => console.log(err)
    );
  };

  onReceiveStream = (stream) => {
    var video = this.partnerVideoRef.current;
    video.srcObject = stream;
    this.setState({ connectionState: 'inCall' });
  };

  handleConnect = () => {
    this.prepareSelfVideo();

    console.log('Trying to connect');

    var conn = this.peer.connect(this.props.partnerPeerId, { reliable: true });

    console.log(conn)

    this.setState({ connection: conn });

    conn.on('open', (id) => {
      console.log('Peer ID: ' + this.peerId);
      this.setState({ connectionState: 'connected' });
    });

    this.peer.on('connection', (e) => console.log('Peer connected', e));
    this.peer.on('call', this.onReceiveCall.bind(this));
  };

  handleCall = () => {
    this.call(this.props.partnerPeerId);
  };


  handleInit = () => {
      this.handleConnect();
  }

  async componentDidMount() {}

  render() {
    return this.state.shouldShow ? (
      <div className={styles.videoChatWrapper}>
        <div className={styles.wrapper}>
          {/* <button
            className={cn(styles.button, {
              [styles.connected]: this.state.connectionState === 'connected',
              [styles.inCall]: this.state.connectionState === 'inCall',
            })}
            onClick={this.handleClick}
          >
            {this.buttonLabel}
          </button> */}

          {/* <button onClick={this.handleCall}>Call</button> */}

          <div className={styles.videosWrapper}>
            <div className={styles.video}>
              <span>You</span>
              <video ref={this.userVideoRef} autoPlay></video>
            </div>
            <div className={styles.video}>
              <span>Partner</span>
              <video ref={this.partnerVideoRef} autoPlay></video>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div>No active call</div>
    );
  }
}
