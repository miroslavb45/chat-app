import { createBrowserHistory } from 'history';
import { call, takeEvery } from 'redux-saga/effects';
import { navigateToAction } from './actions';

const browserHistory = createBrowserHistory();

function* navigateToSaga(url) {
  yield call([browserHistory, browserHistory.push], url);
  return;
}

export { browserHistory, navigateToSaga };

function* navigateToListener(action) {
  try {
    yield call(navigateToSaga, action.payload);
  } catch (e) {
    console.log(e);
  }
}

export default function* navigationListenerSaga() {
  yield takeEvery(navigateToAction, navigateToListener);
}
