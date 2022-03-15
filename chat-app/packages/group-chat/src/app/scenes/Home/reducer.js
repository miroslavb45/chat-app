import { createReducer } from '@reduxjs/toolkit';

import { getWorkspacesSuccess } from './actions';

const initialState = {
  workspaces: [],
};

export default createReducer(initialState, {
  [getWorkspacesSuccess]: (state, { payload }) => {
    console.log(state, payload);

    state.workspaces = [...payload.workspaces];
  },
});
