import { createAction } from '@reduxjs/toolkit';
import createRestAction from '../../../../../utils/restActionCreator';
import createWsAction from '../../../../../utils/wsActionCreator';

export const getWorkspaceChannelsAction = createAction('GET_WORKSPACE_CHANNELS_INTERNAL');
export const getWorkspaceChannelAction = createAction('GET_WORKSPACE_CHANNEL_INTERNAL');
export const newChannelMessageAction = createAction('NEW_CHANNEL_MESSAGE_INTERNAL');

export const {
  success: getWorkspaceChannelsSuccess,
  error: getWorkspaceChannelsError,
  action: getWorkspaceChannels,
} = createRestAction('GET_WORKSPACE_CHANNELS', 'channels', 'GET');

export const {
  success: getWorkspaceChannelSuccess,
  error: getWorkspaceChannelError,
  action: getWorkspaceChannel,
} = createRestAction('GET_WORKSPACE_CHANNEL', 'channel', 'GET');

export const {
  success: createWorkspaceChannelSuccess,
  error: createWorkspaceChannelError,
  action: createWorkspaceChannel,
} = createRestAction('CREATE_WORKSPACE_CHANNEL', 'channel', 'POST');

export const {
  success: renameWorkspaceChannelSuccess,
  error: renameWorkspaceChannelError,
  action: renameWorkspaceChannel,
} = createRestAction('RENAME_WORKSPACE_CHANNEL', 'renameChannel', 'POST');

export const {
  success: deleteWorkspaceChannelSuccess,
  error: deleteWorkspaceChannelError,
  action: deleteWorkspaceChannel,
} = createRestAction('DELETE_WORKSPACE_CHANNEL', 'deleteChannel', 'POST');

export const {
  success: joinChannelSuccess,
  error: joinChannelError,
  action: joinChannel,
} = createWsAction('JOIN_TO_CHANNEL_MESSAGE', 'SUBSCRIBED_TO_CHANNEL_MESSAGE');

export const {
  success: subscribeToChannelSuccess,
  error: subscribeToChannelError,
  action: subscribeToChannel,
} = createWsAction('SUBSCRIBE_TO_CHANNEL_MESSAGE', 'SUBSCRIBED_TO_CHANNEL_MESSAGE');

export const {
  success: sendChannelMessageSuccess,
  error: sendChannelMessageError,
  action: sendChannelMessage,
} = createWsAction('SEND_CHANNEL_MESSAGE_MESSAGE', 'CHANNEL_MESSAGE_MESSAGE');

