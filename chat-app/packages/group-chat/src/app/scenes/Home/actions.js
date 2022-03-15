import { createAction } from '@reduxjs/toolkit';

export const getWorkspaces = createAction('REQUEST_GET_WORKSPACES', () => ({
  payload: {
    url: 'workspaces',
    method: 'GET',
    success: getWorkspacesSuccess,
    error: getWorkspacesError
  },
}));
export const getWorkspacesSuccess = createAction('WORKSPACES_SUCCESS');
export const getWorkspacesError = createAction('WORKSPACES_ERROR');
