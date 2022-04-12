import { createAction } from '@reduxjs/toolkit';
import createRestAction from '../../../../../utils/restActionCreator';

export const toggleProfileSettingsModal = createAction('TOGGLE_PROFILE_SETTINGS_MODAL');

export const {
  action: renameWorkspaceUser,
  success: renameWorkspaceUserSuccess,
  error: renameWorkspaceUserError,
} = createRestAction('RENAME_WORKSPACE_USER', 'changeName', 'POST');
