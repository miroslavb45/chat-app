import { all, call, spawn } from 'redux-saga/effects';
import channelSaga from './scenes/Home/components/Channel/sagas';
import messagingSaga from './scenes/Home/components/Messaging/sagas';
import { default as workspaceSaga } from './scenes/Workspace/sagas';
import { navigationListenerSaga } from './shared/sagas/navigation/saga';
import userInfoSaga from './shared/sagas/user/saga';

const rootSagas = [
  // authSaga,
  userInfoSaga,
  workspaceSaga,
  channelSaga,
  messagingSaga,
  navigationListenerSaga,
];

const spawnRestartableSaga = (saga) =>
  spawn(function* () {
    while (true) {
      try {
        yield call(saga);
      } catch (error) {
        console.error(error, saga);
      }
    }
  });

export default function* rootSaga() {
  yield all(rootSagas.map(spawnRestartableSaga));
}
