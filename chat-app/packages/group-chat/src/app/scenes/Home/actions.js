import { createAction } from '@reduxjs/toolkit';
import createRestAction from '../../../utils/restActionCreator';
import createWsAction from '../../../utils/wsActionCreator';

export const selectChannelAction = createAction('SELECT_CHANNEL_INTERNAL');
export const selectPrivateMessageAction = createAction('SELECT_PRIVATE_MESSAGE_INTERNAL');
export const unselectMainContentAction = createAction('UNSELECT_MAIN_CONTENT_INTERNAL')


export const { action: getJoinedChannels, success: getJoinedChannelsSuccess, error: getJoinedChannelsError } = createRestAction('GET_JOINED_CHANNELS', 'joinedChannels', 'GET' );