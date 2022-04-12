import { createReducer } from '@reduxjs/toolkit';
import { isNullOrUndefined } from '@typegoose/typegoose/lib/internal/utils';
import { getUserInfoSuccess } from '../../../Login/actions';
import { selectPrivateMessageAction } from '../../actions';
import {
  deletePrivateMessageSuccess,
  editPrivateMessageAction,
  getPrivateMessagingSuccess,
  getWorkspaceUsersSuccess,
  modifyPrivateMessageSuccess,
  newPrivateMessageAction,
  userJoinedAction,
  userLeftAction,
} from './actions';
import { toggleDeleteMessagingModalAction } from './components/DeleteMessagingModal/actions';

const initialState = {
  availableUsers: [],
  activeMessaging: null,
  privateMessages: {},
  myWorkspaceUserId: null,
  isDeleteModalOpen: false,
};

export default createReducer(initialState, {
  [getWorkspaceUsersSuccess]: (state, { payload }) => {
    state.availableUsers = payload.users;
  },

  [getPrivateMessagingSuccess]: (state, { payload }) => {
    state.activeMessaging = payload.recipient;

    state.privateMessages[payload.recipient.id] = payload.messages;
  },

  [newPrivateMessageAction]: (state, { payload }) => {
    const targetUser = payload.author === state.myWorkspaceUserId ? payload.recipient : payload.author;

    if (state.privateMessages[targetUser]) {
      state.privateMessages[targetUser].push(payload);
    } else {
      state.privateMessages[targetUser] = [{ ...payload }];
    }

    if (targetUser !== state.activeMessaging?.id) {
      // New notification
      const index = state.availableUsers.findIndex((item) => item.id === targetUser);
      state.availableUsers[index] = { ...state.availableUsers[index], notification: true };
    }
  },

  [getUserInfoSuccess]: (state, { payload }) => {
    state.myWorkspaceUserId = payload.workspaceUser._id;
  },

  [selectPrivateMessageAction]: (state, { payload }) => {
    const index = state.availableUsers?.findIndex((i) => i.id === payload.id);
    if (!isNullOrUndefined(index)) {
      state.availableUsers[index] = { ...state.availableUsers[index], notification: false };
    }
  },

  [deletePrivateMessageSuccess]: (state, { payload }) => {
    const targetUser = payload.author === state.myWorkspaceUserId ? payload.recipient : payload.author;

    if (state.privateMessages[targetUser]) {
      state.privateMessages[targetUser] = state.privateMessages[targetUser].filter((i) => i._id !== payload.messageId);
    }
  },

  [editPrivateMessageAction]: (state, { payload }) => {
    state.activeMessaging.editingMessage = payload;
  },

  [modifyPrivateMessageSuccess]: (state, { payload }) => {
    if (state.activeMessaging.editingMessage && state.activeMessaging.editingMessage._id === payload._id) {
      state.activeMessaging.editingMessage = null;
    }

    const targetUser = payload.author === state.myWorkspaceUserId ? payload.recipient : payload.author;

    if (state.privateMessages[targetUser]) {
      const index = state.privateMessages[targetUser].findIndex((item) => item._id === payload._id);
      state.privateMessages[targetUser][index] = { ...payload };
    }
  },

  [toggleDeleteMessagingModalAction]: (state) => ({
    ...state,
    isDeleteModalOpen: !state.isDeleteModalOpen,
  }),

  [userJoinedAction]: (state, { payload: { userId } }) => {
    const index = state.availableUsers?.findIndex((i) => i.id === userId);
    if (!isNullOrUndefined(index)) {
      state.availableUsers[index] = { ...state.availableUsers[index], availability: 'Online' };
    }
  },

  [userLeftAction]: (state, { payload: { userId } }) => {
    const index = state.availableUsers?.findIndex((i) => i.id === userId);
    if (!isNullOrUndefined(index)) {
      state.availableUsers[index] = { ...state.availableUsers[index], availability: 'Offline' };
    }
  },
});
