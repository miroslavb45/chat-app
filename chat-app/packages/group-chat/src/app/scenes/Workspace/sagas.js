import { call, take, all, put, takeEvery, select } from 'redux-saga/effects';
import { navigateToSaga } from '../../shared/sagas/navigation/saga';
import { deleteWorkspaceChannelError, deleteWorkspaceChannelSuccess, getWorkspaceChannels, getWorkspaceChannelsSuccess } from '../Home/components/Channel/actions';
import {
  selectWorkspaceAction,
  selectWorkspace,
  selectWorkspaceError,
  unselectWorkspaceAction,
  unselectWorkspaceError,
  selectWorkspaceSuccess,
  unselectWorkspace,
  createWorkspace,
  createWorkspaceAction,
  createWorkspaceSuccess,
  getWorkspace,
  getWorkspaceSuccess,
  getWorkspaceError,
  getWorkspaceAction,
} from './actions';

function* selectWorkspaceSaga(action) {
  try {
    const workspace = action.payload;

    if (!workspace.isActive) {
      yield put(selectWorkspace({ id: workspace.value }));
      yield take(selectWorkspaceSuccess);
    }

    yield call(navigateToSaga, '/');
    return;
  } catch (e) {
    yield put(selectWorkspaceError(e));
  }
}

function* unselectWorkspaceSaga(action) {
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

    yield put(getWorkspace({ id: workspaceId }));
    yield take(getWorkspaceSuccess);

    yield put(getWorkspaceChannels({workspace: workspaceId}));
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
