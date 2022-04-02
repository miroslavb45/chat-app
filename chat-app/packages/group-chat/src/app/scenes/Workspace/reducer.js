import { createReducer } from '@reduxjs/toolkit';
import { getUserInfoSuccess } from '../Login/actions';

import { getWorkspacesSuccess, getWorkspaceSuccess, selectWorkspaceSuccess, unselectWorkspaceSuccess } from './actions';

const initialState = {
  availableWorkspaces: [],
  activeWorkspace: null,
};

export default createReducer(initialState, {
  [getWorkspacesSuccess]: (state, { payload }) => {
    state.availableWorkspaces = [...payload.workspaces];
  },
  [getWorkspaceSuccess]: (state, { payload }) => {
    state.activeWorkspace = { ...payload };
  },
  [selectWorkspaceSuccess]: (state, { payload }) => {
    state.activeWorkspace = payload.id;
  },

  [getUserInfoSuccess]: (state, { payload }) => {
    state.activeWorkspace = payload.dbUser.activeWorkspace;
  },

  [unselectWorkspaceSuccess]: (state) => {
    state.activeWorkspace = null;
  },
});
