import { createReducer } from '@reduxjs/toolkit';
import { getJoinedChannelsSuccess } from '../../actions';
import {
  createWorkspaceChannelError,
  createWorkspaceChannelSuccess,
  deleteWorkspaceChannelError,
  deleteWorkspaceChannelSuccess,
  getWorkspaceChannelsSuccess,
  getWorkspaceChannelSuccess,
  joinChannelSuccess,
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
    }
  },
});
