import Peer from 'peerjs';
import { all, put, select, takeEvery } from 'redux-saga/effects';
import {
  acceptVideoCall,
  acceptVideoCallAction,
  callEndedAction,
  callStartedAction,
  declineVideoCallAction,
  endVideoCall,
  incomingCallAction,
  startVideoCall,
  startVideoCallAction,
  toggleAudioAction,
  toggleIncomingVideoCallModal,
  toggleVideoAction,
} from './actions';
import { partnerVideo, selfVideo } from './components/InCallModal/InCallModal';

export let peer = null;
export let connection = null;
export let callObj = null;

let selfVideoStream = null;

function getMedia(options, success, error) {
  navigator.getUserMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  navigator.getUserMedia(options, success, error);
}

function onReceiveCall(call) {
  callObj = call;
  getMedia(
    { audio: true, video: true },
    (stream) => {
      call.answer(stream);
    },
    (err) => console.log(err)
  );

  call.on('stream', (stream) => {
    var video = partnerVideo.current;
    video.srcObject = stream;
  });
}

function prepareSelfVideo() {
  getMedia(
    { audio: false, video: true },
    (stream) => {
      var video = selfVideo.current;
      video.srcObject = stream;
      selfVideoStream = stream;
    },
    (err) => console.log(err)
  );
}

function onReceiveStream(stream) {
  var video = partnerVideo.current;
  video.srcObject = stream;
}

function call(id) {
  getMedia(
    { audio: true, video: true },
    (stream) => {
      callObj = peer.call(id, stream);

      callObj.on('stream', onReceiveStream);
    },
    (err) => console.log(err)
  );
}

function* incomingCallSaga(action) {
  const { from } = action.payload;

  const myId = yield select((state) => state.user.workspaceUser._id);

  const { name } = yield select((state) => state.messaging.availableUsers.find((i) => i.id === from));

  if (from !== myId) {
    yield put(
      toggleIncomingVideoCallModal({
        partnerId: from,
        partnerName: name,
      })
    );
  }
}

function* acceptVideoCallSaga(action) {
  const { partnerId } = yield select((state) => state.videoChat);

  yield put(acceptVideoCall({ workspaceUserId: partnerId }));
}

function* declineVideoCallSaga(action) {
  const { partnerId } = yield select((state) => state.videoChat);

  yield put(endVideoCall({ workspaceUserId: partnerId }));
}

function* outgoingVideoCallSaga(action) {
  const { partnerId } = yield select((state) => state.videoChat);

  yield put(startVideoCall({ workspaceUserId: partnerId }));
}

// eslint-disable-next-line require-yield
function* callStartedSaga(action) {
  const { partnerId, partnerName, shouldCall } = yield select((state) => state.videoChat);
  const myId = yield select((state) => state.user.workspaceUser._id);

  prepareSelfVideo();

  peer = new Peer(myId, {
    config: {
      iceServers: [{ url: 'stun:stun.l.google.com:19302' }],
    },
    host: 'localhost',
    port: 4444,
    path: '/myapp',
    secure: false,
  });

  peer.on('call', onReceiveCall.bind(this));

  peer.on('open', () => {
    console.log(`Peer connection [${partnerName}] successfully opened.`);
  });

  peer.on('disconnected', () => console.log(`Peer connection [${partnerName}] closed. `));

  if (shouldCall) {
    console.log('Connecting to ', partnerName);
    connection = peer.connect(partnerId);
    call(partnerId);
  }
}

// eslint-disable-next-line require-yield
function* callEndedSaga(action) {
  if (callObj) {
    if (callObj.localStream.getVideoTracks().length > 0) {
      callObj.localStream.getVideoTracks()[0].stop();
    }

    if (callObj.localStream.getAudioTracks().length > 0) {
      callObj.localStream.getAudioTracks()[0].stop();
    }

    if (selfVideoStream.getVideoTracks().length > 0) {
      selfVideoStream.getVideoTracks()[0].stop();
    }

    if (selfVideoStream.getAudioTracks().length > 0) {
      selfVideoStream.getAudioTracks()[0].stop();
    }
  }

  peer.disconnect();
  console.log('Connection close called');
}

// eslint-disable-next-line require-yield
function* toggleMicrophoneSaga(action) {
  const isMicOn = yield select((state) => state.videoChat.isAudioOn);

  if (callObj) {
    if (callObj.localStream.getAudioTracks().length > 0) {
      // Mute my video in remote stream
      callObj.localStream.getAudioTracks()[0].enabled = isMicOn;
    }

    if (selfVideo.current.srcObject.getAudioTracks().length > 0) {
      // Mute my video at my stream
      selfVideo.current.srcObject.getAudioTracks()[0].enabled = isMicOn;
    }
  }
}

// eslint-disable-next-line require-yield
function* toggleCameraSaga(action) {
  const isVideoOn = yield select((state) => state.videoChat.isVideoOn);
  if (callObj) {
    if (callObj.localStream.getVideoTracks().length > 0) {
      // Mute my video in remote stream
      callObj.localStream.getVideoTracks()[0].enabled = isVideoOn;
    }

    if (selfVideo.current.srcObject.getVideoTracks().length > 0) {
      // Mute my video at my stream
      selfVideo.current.srcObject.getVideoTracks()[0].enabled = isVideoOn;
    }
  }
}

export default function* videoChatSaga() {
  yield all([
    takeEvery(acceptVideoCallAction, acceptVideoCallSaga),
    takeEvery(declineVideoCallAction, declineVideoCallSaga),
    takeEvery(incomingCallAction, incomingCallSaga),
    takeEvery(startVideoCallAction, outgoingVideoCallSaga),
    takeEvery(callStartedAction, callStartedSaga),
    takeEvery(callEndedAction, callEndedSaga),
    takeEvery(toggleAudioAction, toggleMicrophoneSaga),
    takeEvery(toggleVideoAction, toggleCameraSaga),
  ]);
}
