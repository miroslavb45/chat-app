import { all, spawn, call } from 'redux-saga/effects';
import channelSaga from './scenes/Home/components/Channel/sagas';

import { default as workspaceSaga } from './scenes/Workspace/sagas';
import userInfoSaga from './shared/sagas/user/saga';


const rootSagas = [
  // authSaga,
  userInfoSaga,
  workspaceSaga,
  channelSaga
];

const spawnRestartableSaga = (saga) =>
  spawn(function*() {
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
