import { createAction } from '@reduxjs/toolkit';
import createWsAction from '../../../utils/wsActionCreator';

export const startVideoCallAction = createAction('START_VIDEO_CALL_INTERNAL');
export const hangUpVideoCallAction = createAction('HANG_UP_VIDEO_CALL_INTERNAL');

export const acceptVideoCallAction = createAction('ACCEPT_VIDEO_CALL_INTERNAL');
export const declineVideoCallAction = createAction('DECLINE_VIDEO_CALL_INTERNAL');

export const toggleIncomingVideoCallModal = createAction('TOGGLE_INCOMING_VIDEO_CALL_MODAL_INTERNAL');
export const toggleOutgoingVideoCallModal = createAction('TOGGLE_OUTGOING_VIDEO_CALL_MODAL_INTERNAL');

export const toggleVideoAction = createAction('TOGGLE_VIDEO_INTERNAL');
export const toggleAudioAction = createAction('TOGGLE_AUDIO_INTERNAL');

export const {
  success: startVideoCallSuccess,
  error: startVideoCallError,
  action: startVideoCall,
} = createWsAction('START_CALL_MESSAGE');

export const {
  success: acceptVideoCallSuccess,
  error: acceptVideoCallError,
  action: acceptVideoCall,
} = createWsAction('ACCEPT_CALL_MESSAGE');

export const {
  success: endVideoCallSuccess,
  error: endVideoCallError,
  action: endVideoCall,
} = createWsAction('END_CALL_MESSAGE');

export const incomingCallAction = createAction('INCOMING_CALL_MESSAGE');
export const callStartedAction= createAction('CALL_STARTED_MESSAGE');
export const callEndedAction = createAction('CALL_ENDED_MESSAGE');
