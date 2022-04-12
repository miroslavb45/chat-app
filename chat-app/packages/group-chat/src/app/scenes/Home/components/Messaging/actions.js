import { createAction } from '@reduxjs/toolkit';
import createRestAction from '../../../../../utils/restActionCreator';
import createWsAction from '../../../../../utils/wsActionCreator';

export const getPrivateMessagingAction = createAction('GET_PRIVATE_MESSAGING_INTERNAL');
export const getWorkspaceUsersActions = createAction('GET_WORKSPACE_USERS_INTERNAL');

export const newPrivateMessageAction = createAction('NEW_PRIVATE_MESSAGE_INTERNAL');
export const editPrivateMessageAction = createAction('EDIT_PRIVATE_MESSAGE_INTERNAL');

export const userJoinedAction = createAction('USER_JOINED_INTERNAL');
export const userLeftAction = createAction('USER_LEFT_INTERNAL');

export const {
  action: getPrivateMessaging,
  success: getPrivateMessagingSuccess,
  error: getPrivateMessagingError,
} = createRestAction('PRIVATE_MESSAGING', 'messaging', 'GET');

export const {
  action: getWorkspaceUsers,
  success: getWorkspaceUsersSuccess,
  error: getWorkspaceUsersError,
} = createRestAction('WORKSPACE_USERS', 'workspaceUsers', 'GET');

export const {
  success: subscribeToPrivateMessagingSuccess,
  error: subscribeToPrivateMessagingError,
  action: subscribeToPrivateMessaging,
} = createWsAction('SUBSCRIBE_TO_PRIVATE_MESSAGING_MESSAGE', 'SUBSCRIBED_TO_PRIVATE_MESSAGING_MESSAGE');

export const {
  success: sendPrivateMessageSuccess,
  error: sendPrivateMessageError,
  action: sendPrivateMessage,
} = createWsAction('SEND_PRIVATE_MESSAGE_MESSAGE', 'PRIVATE_MESSAGE_MESSAGE');

export const {
  success: deletePrivateMessageSuccess,
  error: deletePrivateMessageError,
  action: deletePrivateMessage,
} = createWsAction('DELETE_PRIVATE_MESSAGE_MESSAGE', 'DELETED_PRIVATE_MESSAGE_MESSAGE');

export const {
  success: modifyPrivateMessageSuccess,
  error: modifyPrivateMessageError,
  action: modifyPrivateMessage,
} = createWsAction('MODIFY_PRIVATE_MESSAGE_MESSAGE', 'MODIFIED_PRIVATE_MESSAGE_MESSAGE');

export const {
  success: deletePrivateMessagingSuccess,
  error: deletePrivateMessagingError,
  action: deletePrivateMessaging,
} = createRestAction('DELETE_PRIVATE_MESSAGING', 'deleteMessaging', 'POST');
