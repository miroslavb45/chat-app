import { createReducer } from '@reduxjs/toolkit';
import { isNullOrUndefined } from '@typegoose/typegoose/lib/internal/utils';
import { getJoinedChannelsSuccess, selectChannelAction } from '../../actions';
import {
  createWorkspaceChannelError,
  createWorkspaceChannelSuccess,
  deleteChannelMessageSuccess,
  deleteWorkspaceChannelError,
  deleteWorkspaceChannelSuccess,
  editChanelMessageAction,
  getWorkspaceChannelsSuccess,
  getWorkspaceChannelSuccess,
  joinChannelSuccess,
  modifyChannelMessageSuccess,
  newChannelMessageAction,
  renameWorkspaceChannelError,
  renameWorkspaceChannelSuccess,
} from './actions';
import { toggleCreateChannelModalAction } from './components/CreateChannelModal/actions';
import { toggleDeleteChannelModalAction } from './components/DeleteChannelModal/actions';
import { toggleRenameChannelModalAction } from './components/RenameChannelModal/actions';

const initialState = {
  availableChannels: [],
  activeChannel: null,
  joinedChannels: [],
  channelMessages: {},
  isCreateModalOpen: false,
  isRenameModalOpen: false,
  createChannelError: null,
  isDeleteModalOpen: false,
};

export default createReducer(initialState, {
  [getWorkspaceChannelsSuccess]: (state, { payload: { channels } }) => ({
    ...state,
    availableChannels: [...channels],
  }),
  [getWorkspaceChannelSuccess]: (state, { payload }) => {
    state.activeChannel = payload;

    if (payload.messages?.length > 0) {
      state.channelMessages[payload.id] = payload.messages;
    }
  },
  [toggleCreateChannelModalAction]: (state) => ({
    ...state,
    isCreateModalOpen: !state.isCreateModalOpen,
  }),

  [toggleRenameChannelModalAction]: (state) => ({
    ...state,
    isRenameModalOpen: !state.isRenameModalOpen,
  }),

  [toggleDeleteChannelModalAction]: (state) => ({
    ...state,
    isDeleteModalOpen: !state.isDeleteModalOpen,
  }),

  [createWorkspaceChannelSuccess]: (state, { payload }) => {
    state.availableChannels = [...state.availableChannels, { ...payload, id: payload._id }];
    state.createChannelError = null;
  },

  [renameWorkspaceChannelSuccess]: (state, { payload }) => {
    const foundIndex = state.availableChannels.findIndex((x) => x.id === payload._id);
    state.availableChannels[foundIndex] = { ...payload, id: payload._id };
    state.renameChannelError = null;
  },

  [renameWorkspaceChannelError]: (state, { payload }) => {
    state.workspaceChannelError = payload;
  },

  [deleteWorkspaceChannelSuccess]: (state, { payload }) => {
    state.availableChannels = state.availableChannels.filter((i) => i.id !== payload._id);
    state.renameChannelError = null;
  },

  [deleteWorkspaceChannelError]: (state, { payload }) => {
    state.workspaceChannelError = payload;
  },

  [createWorkspaceChannelError]: (state, { payload }) => {
    state.createChannelError = payload;
  },

  [getJoinedChannelsSuccess]: (state, { payload }) => {
    state.joinedChannels = payload.channels;
  },

  [joinChannelSuccess]: (state, { payload }) => {
    state.joinedChannels = [...state.joinedChannels, payload.channel];
  },

  [newChannelMessageAction]: (state, { payload }) => {
    if (payload.channel) {
      if (state.channelMessages[payload.channel]) {
        state.channelMessages[payload.channel].push(payload);
      } else {
        state.channelMessages[payload.channel] = [{ ...payload }];
      }
      if (payload.channel !== state.activeChannel?.id) {
        // New notification
        const index = state.availableChannels.findIndex((item) => item.id === payload.channel);
        state.availableChannels[index] = { ...state.availableChannels[index], notification: true };
      }
    }
  },

  [deleteChannelMessageSuccess]: (state, { payload }) => {
    if (payload.channelId) {
      if (state.channelMessages[payload.channelId]) {
        state.channelMessages[payload.channelId] = state.channelMessages[payload.channelId].filter(
          (i) => i._id !== payload.messageId
        );
      }
    }
  },

  [editChanelMessageAction]: (state, { payload }) => {
    state.activeChannel.editingMessage = payload;
  },

  [modifyChannelMessageSuccess]: (state, { payload }) => {
    if (state.activeChannel.editingMessage && state.activeChannel.editingMessage._id === payload._id) {
      state.activeChannel.editingMessage = null;
    }

    if (state.channelMessages[payload.channel]) {
      const index = state.channelMessages[payload.channel].findIndex((item) => item._id === payload._id);
      state.channelMessages[payload.channel][index] = { ...payload };
    }
  },

  [selectChannelAction]: (state, { payload }) => {
    const index = state.availableChannels?.findIndex((i) => i.id === payload.id);
    if (!isNullOrUndefined(index)) {
      console.log('Notification remove for channel: ', state.availableChannels[index].name);
      state.availableChannels[index] = { ...state.availableChannels[index], notification: false };
    }
  },
});
