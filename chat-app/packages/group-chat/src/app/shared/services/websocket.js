import { getAuth } from 'firebase/auth';
import { io } from 'socket.io-client';
import { store } from '../../app';
import { newChannelMessageAction } from '../../scenes/Home/components/Channel/actions';

let websocketConnection = null;

export const getActiveWsConnection = () => websocketConnection;

export const connectToWebsocket = async () => {
  if (!websocketConnection) {
    const auth = getAuth();
    const jwt = await auth.currentUser.getIdToken();

    websocketConnection = new io(`http://api.localhost`, { auth: { jwt }, transports: ['websocket'] });

    // Channel message listeners
    websocketConnection.on('CHANNEL_MESSAGE_MESSAGE', (e) => {
      store.dispatch(newChannelMessageAction(e));
    });
  }
};
