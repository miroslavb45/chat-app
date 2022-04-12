import { all, put, select, takeEvery } from 'redux-saga/effects';
import { selectPrivateMessageAction } from '../../actions';
import {
  getPrivateMessaging,
  getPrivateMessagingError,
  getWorkspaceUsersError,
  getWorkspaceUsersSuccess,
  subscribeToPrivateMessaging,
} from './actions';

function* selectMessagingSaga(action) {
  try {
    const userId = action.payload.id;

    yield put(getPrivateMessaging({ entityId: userId }));

    return;
  } catch (e) {
    yield put(getPrivateMessagingError(e));
  }
}
function* subscribeToPrivateMessagingSaga(action) {
  try {
    const availableUsers = yield select((state) => state.messaging.availableUsers);

    for (const user of availableUsers) {
      yield put(subscribeToPrivateMessaging({ userId: user.id }));
    }

    return;
  } catch (e) {
    yield put(getWorkspaceUsersError(e));
  }
}

export default function* messagingSaga() {
  yield all([
    takeEvery(getWorkspaceUsersSuccess, subscribeToPrivateMessagingSaga),
    takeEvery(selectPrivateMessageAction, selectMessagingSaga),
  ]);
}
