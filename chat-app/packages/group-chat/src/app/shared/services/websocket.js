import { getAuth } from 'firebase/auth';
import { io } from 'socket.io-client';
import { store } from '../../app';
import {
  deleteChannelMessageSuccess,
  modifyChannelMessageSuccess,
  newChannelMessageAction
} from '../../scenes/Home/components/Channel/actions';
import {
  deletePrivateMessageSuccess,
  modifyPrivateMessageSuccess,
  newPrivateMessageAction,
  userJoinedAction,
  userLeftAction
} from '../../scenes/Home/components/Messaging/actions';
import { callEndedAction, callStartedAction, incomingCallAction } from '../../scenes/VideoChat/actions';

let websocketConnection = null;

export const getActiveWsConnection = () => websocketConnection;

export const connectToWebsocket = async () => {
  if (websocketConnection) {
    websocketConnection.disconnect();
    websocketConnection.close();

    // Remove listeners
    websocketConnection.off('CHANNEL_MESSAGE_MESSAGE');
    websocketConnection.off('DELETED_CHANNEL_MESSAGE_MESSAGE');
    websocketConnection.off('MODIFIED_CHANNEL_MESSAGE_MESSAGE');

    websocketConnection.off('PRIVATE_MESSAGE_MESSAGE');
    websocketConnection.off('DELETED_PRIVATE_MESSAGE_MESSAGE');
    websocketConnection.off('MODIFIED_PRIVATE_MESSAGE_MESSAGE');

    websocketConnection.off('USER_JOINED');
    websocketConnection.off('USER_LEFT');

    ///////
    console.log('Disconnected from ws');
  }

  const baseUrl = 'api.localhost';

  const auth = getAuth();
  const jwt = await auth.currentUser.getIdToken();

  websocketConnection = new io(`http://${baseUrl}`, { auth: { jwt: jwt }, transports: ['websocket'] });

  // Channel message listeners
  websocketConnection.on('CHANNEL_MESSAGE_MESSAGE', (e) => {
    store.dispatch(newChannelMessageAction(e));
  });

  websocketConnection.on('DELETED_CHANNEL_MESSAGE_MESSAGE', (e) => {
    store.dispatch(deleteChannelMessageSuccess(e));
  });

  websocketConnection.on('MODIFIED_CHANNEL_MESSAGE_MESSAGE', (e) => {
    store.dispatch(modifyChannelMessageSuccess(e));
  });

  // Private message listeners
  websocketConnection.on('PRIVATE_MESSAGE_MESSAGE', (e) => {
    store.dispatch(newPrivateMessageAction(e));
  });

  websocketConnection.on('DELETED_PRIVATE_MESSAGE_MESSAGE', (e) => {
    store.dispatch(deletePrivateMessageSuccess(e));
  });

  websocketConnection.on('MODIFIED_PRIVATE_MESSAGE_MESSAGE', (e) => {
    store.dispatch(modifyPrivateMessageSuccess(e));
  });

  // User action listeners
  websocketConnection.on('USER_JOINED_MESSAGE', (e) => {
    store.dispatch(userJoinedAction(e));
  });

  websocketConnection.on('USER_LEFT_MESSAGE', (e) => {
    store.dispatch(userLeftAction(e));
  });

  // Video Call action listeners
  websocketConnection.on('CALL_STARTED_MESSAGE', (e) => {
    console.log('Call started')
    store.dispatch(callStartedAction(e));
  });

  websocketConnection.on('CALL_ENDED_MESSAGE', (e) => {
    store.dispatch(callEndedAction(e));
  });

  websocketConnection.on('INCOMING_CALL_MESSAGE', (e) => {
    store.dispatch(incomingCallAction(e));
  });
};

export const disconnectFromWebsocket = async () => {
  if (websocketConnection) {
    websocketConnection.disconnect();
    websocketConnection.close();
  }
};
