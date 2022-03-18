import { createReducer } from '@reduxjs/toolkit';
import { getUserInfoSuccess } from '../Login/actions';

import { getWorkspacesSuccess, getWorkspaceSuccess, selectWorkspaceSuccess, unselectWorkspaceSuccess } from './actions';

const initialState = {
  availableWorkspaces: [],
  selectedWorkspace: null,
};

export default createReducer(initialState, {
  [getWorkspacesSuccess]: (state, { payload }) => {
    state.availableWorkspaces = [...payload.workspaces];
  },  
  [getWorkspaceSuccess]: (state, { payload }) => {
    state.selectedWorkspace = { ...payload };
  },
  [selectWorkspaceSuccess]: (state, { payload }) => {
    state.selectedWorkspace = payload.id;
  },

  [getUserInfoSuccess]: (state, { payload }) => {
    state.selectedWorkspace = payload.activeWorkspace;
  },

  [unselectWorkspaceSuccess]: (state) => {
    state.selectedWorkspace = null;
  },
});
