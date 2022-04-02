import { put, take, takeEvery, call } from 'redux-saga/effects';
import { getUserInfoAction, getUserInfoError, getUserInfoSuccess, getUserInfo } from '../../../scenes/Login/actions';
import { selectWorkspaceError } from '../../../scenes/Workspace/actions';
import { navigateToSaga } from '../navigation/saga';

function* getUserInformation(action) {
  try {
      yield put(getUserInfo());
      const { payload: { dbUser }} = yield take(getUserInfoSuccess);
        if(dbUser?.activeWorkspace){
            console.log("WORKSPACE SELECTED")

            console.log('user has an active workspace');
            yield call(navigateToSaga, '/');
        }
  } catch (e) {
    console.log(e)
    yield put(getUserInfoError(e));
  }
}

export default function* userInfoSaga() {
  yield takeEvery(getUserInfoAction, getUserInformation);
}
