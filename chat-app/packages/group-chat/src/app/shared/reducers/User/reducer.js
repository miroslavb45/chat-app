import { createReducer } from '@reduxjs/toolkit';
import {
  renameWorkspaceUserSuccess,
  toggleProfileSettingsModal,
} from '../../../scenes/Home/components/ProfileSettingsModal/actions';
import { getUserInfoSuccess } from '../../../scenes/Login/actions';

const initialState = {
  workspaceUser: {},
  dbUser: {},
  isRenameModalOpen: false,
};

export default createReducer(initialState, {
  [getUserInfoSuccess]: (state, { payload }) => {
    state.dbUser = payload.dbUser;
    state.workspaceUser = payload.workspaceUser;
  },

  [toggleProfileSettingsModal]: (state, _) => {
    state.isRenameModalOpen = !state.isRenameModalOpen;
  },

  [renameWorkspaceUserSuccess]: (state, { payload }) => {
    state.workspaceUser.displayName = payload.name;
  },
});
