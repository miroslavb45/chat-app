import { createBrowserHistory } from 'history';
import { call, takeEvery } from 'redux-saga/effects';

const browserHistory = createBrowserHistory();

function* navigateToSaga(url) {
  yield call([browserHistory, browserHistory.push], url);
  return;
}

export { browserHistory, navigateToSaga };
