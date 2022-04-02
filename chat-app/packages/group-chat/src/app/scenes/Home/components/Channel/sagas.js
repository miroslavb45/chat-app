import { all, put, select, take, takeEvery } from 'redux-saga/effects';
import { selectChannelAction } from '../../actions';
import {
    createWorkspaceChannelSuccess,
    getWorkspaceChannel, getWorkspaceChannelError,
    joinChannel,
    joinChannelSuccess,
    subscribeToChannel,
    subscribeToChannelSuccess
} from './actions';
import { toggleCreateChannelModalAction } from './components/CreateChannelModal/actions';

function* createWorkspaceChannelSaga(action) {
  try {
    yield put(toggleCreateChannelModalAction());

    return;
  } catch (e) {
    // yield put(selectWorkspaceError(e));
  }
}

function* selectChannelSaga(action) {
  try {
    const channelId = action.payload.id;

    yield put(getWorkspaceChannel({ id: channelId }));

    const isJoined = (yield select((state) => state.channel.joinedChannels))?.includes(channelId);

    if (isJoined) {
      console.log('Already joined, just subscribe');
      yield put(subscribeToChannel({ channel: channelId }));
      yield take(subscribeToChannelSuccess);
      console.log('Subscribed successfully.');
    } else {
      console.log('Not joined yet, join and subscribe too');
      yield put(joinChannel({ channel: channelId }));
      yield take(joinChannelSuccess);
      console.log('Joined Successfully');

      yield put(subscribeToChannel({ channel: channelId }));
      yield take(subscribeToChannelSuccess);
      console.log('Subscribed Successfully');
    }

    return;
  } catch (e) {
    yield put(getWorkspaceChannelError(e));
  }
}

export default function* channelSaga() {
  yield all([
    takeEvery(createWorkspaceChannelSuccess, createWorkspaceChannelSaga),
    takeEvery(selectChannelAction, selectChannelSaga),
  ]);
}
