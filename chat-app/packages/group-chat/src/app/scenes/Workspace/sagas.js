import { all, call, put, select, take, takeEvery } from 'redux-saga/effects';
import { navigateToSaga } from '../../shared/sagas/navigation/saga';
import { getWorkspaceChannels, getWorkspaceChannelsSuccess } from '../Home/components/Channel/actions';
import {
  createWorkspace,
  createWorkspaceAction,
  createWorkspaceSuccess,
  getWorkspace,
  getWorkspaceAction,
  getWorkspaceError,
  getWorkspaceSuccess,
  selectWorkspace,
  selectWorkspaceAction,
  selectWorkspaceError,
  selectWorkspaceSuccess,
  unselectWorkspace,
  unselectWorkspaceAction,
  unselectWorkspaceError,
} from './actions';

function* selectWorkspaceSaga(action) {
  try {
    const workspace = action.payload;

    if (!workspace.isActive) {
      yield put(selectWorkspace({ entityId: workspace.value }));
      yield take(selectWorkspaceSuccess);
    }

    yield call(navigateToSaga, '/');
    return;
  } catch (e) {
    yield put(selectWorkspaceError(e));
  }
}

function* unselectWorkspaceSaga() {
  try {
    yield put(unselectWorkspace());
  } catch (e) {
    yield put(unselectWorkspaceError(e));
  }
}

function* createWorkspaceSaga(action) {
  try {
    yield put(createWorkspace({ name: action.payload }));
    const { payload: createdWorkspace } = yield take(createWorkspaceSuccess);
    yield put(selectWorkspaceAction({ value: createdWorkspace.id }));
  } catch (e) {
    yield put(unselectWorkspaceError(e));
  }
}

function* getWorkspaceSaga() {
  try {
    const workspaceId = yield select((state) => state.workspace.activeWorkspace);

    yield put(getWorkspace({ entityId: workspaceId }));
    yield take(getWorkspaceSuccess);

    yield put(getWorkspaceChannels({ entityId: workspaceId }));
    yield take(getWorkspaceChannelsSuccess);
  } catch (e) {
    yield put(getWorkspaceError(e));
  }
}

export default function* workspaceSaga() {
  yield all([
    takeEvery(selectWorkspaceAction, selectWorkspaceSaga),
    takeEvery(unselectWorkspaceAction, unselectWorkspaceSaga),
    takeEvery(createWorkspaceAction, createWorkspaceSaga),
    takeEvery(getWorkspaceAction, getWorkspaceSaga),
  ]);
}
