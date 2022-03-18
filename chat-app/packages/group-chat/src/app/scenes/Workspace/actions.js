import { createAction } from '@reduxjs/toolkit';
import createRestAction from '../../../utils/restActionCreator';

export const {
  action: getWorkspaces,
  success: getWorkspacesSuccess,
  error: getWorkspacesError,
} = createRestAction('GET_WORKSPACES', 'workspaces', 'GET');

export const selectWorkspaceAction = createAction('SELECT_WORKSPACE_INTERNAL');
export const unselectWorkspaceAction = createAction('UNSELECT_WORKSPACE_INTERNAL');

export const {
  action: selectWorkspace,
  success: selectWorkspaceSuccess,
  error: selectWorkspaceError,
} = createRestAction('SELECT_WORKSPACE', 'workspace/select', 'POST');

export const {
  action: unselectWorkspace,
  success: unselectWorkspaceSuccess,
  error: unselectWorkspaceError,
} = createRestAction('UNSELECT_WORKSPACE', 'workspace/unselect', 'POST');

export const createWorkspaceAction = createAction('CREATE_WORKSPACE_INTERNAL');

export const {
  action: createWorkspace,
  success: createWorkspaceSuccess,
  error: createWorkspaceError,
} = createRestAction('CREATE_WORKSPACE', 'workspace', 'POST');

export const getWorkspaceAction = createAction('GET_WORKSPACE_INTERNAL');

export const {
  action: getWorkspace,
  success: getWorkspaceSuccess,
  error: getWorkspaceError,
} = createRestAction('GET_WORKSPACE', 'workspace', 'GET');
