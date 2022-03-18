import { all, spawn, call } from 'redux-saga/effects';

import { default as workspaceSaga } from './scenes/Workspace/sagas';
import userInfoSaga from './shared/sagas/user/saga';
import authSaga from './shared/sagas/auth/saga';


const rootSagas = [
  // authSaga,
  userInfoSaga,
  workspaceSaga
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
