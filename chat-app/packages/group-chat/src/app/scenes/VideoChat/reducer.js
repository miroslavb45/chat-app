import { createReducer } from '@reduxjs/toolkit';
import {
  callEndedAction, callStartedAction, hangUpVideoCallAction,
  startVideoCallAction,
  toggleAudioAction,
  toggleIncomingVideoCallModal,
  toggleOutgoingVideoCallModal,
  toggleVideoAction
} from './actions';

const initialState = {
  isOutgoingCall: false,
  isIncomingCall: false,
  isInCall: false,
  partnerId: null,
  partnerName: null,
  isVideoOn: true,
  isAudioOn: true,
  shouldCall: false
};

export default createReducer(initialState, {
  [toggleOutgoingVideoCallModal]: (state, { payload }) => {
    state.isOutgoingCall = true;
    state.partnerId = payload.partnerId;
    state.partnerName = payload.partnerName;
  },

  [hangUpVideoCallAction]: (state, _) => {
    state.isOutgoingCall = false;
    state.isIncomingCall = false;
    state.isInCall = false;
    state.shouldCall = false;
  },

  [toggleVideoAction]: (state, _) => {
    state.isVideoOn = !state.isVideoOn;
  },

  [toggleAudioAction]: (state, _) => {
    state.isAudioOn = !state.isAudioOn;
  },

  [toggleIncomingVideoCallModal]: (state, { payload }) => {
    state.isIncomingCall = true;
    state.partnerId = payload.partnerId;
    state.partnerName = payload.partnerName;
  },

  [callStartedAction]: (state, { payload }) => {
    state.isOutgoingCall = false;
    state.isIncomingCall = false;
    state.isInCall = true;
  },

  [callEndedAction]: (state, { payload }) => {
    state.isOutgoingCall = false;
    state.isIncomingCall = false;
    state.isInCall = false;
    state.shouldCall = false;
  },

  [startVideoCallAction]: (state, { payload }) => {
    state.shouldCall = true;
  }
});
