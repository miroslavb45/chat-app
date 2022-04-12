import { createReducer } from '@reduxjs/toolkit';
import { selectChannelAction, selectPrivateMessageAction, unselectMainContentAction } from './actions';
import { toggleCreateChannelModalAction } from './components/Channel/components/CreateChannelModal/actions';
import { toggleDeleteChannelModalAction } from './components/Channel/components/DeleteChannelModal/actions';
import { toggleRenameChannelModalAction } from './components/Channel/components/RenameChannelModal/actions';
import { toggleDeleteMessagingModalAction } from './components/Messaging/components/DeleteMessagingModal/actions';
import { toggleProfileSettingsModal } from './components/ProfileSettingsModal/actions';

const initialState = {
  activeMainContent: null,
  isModalOpen: false,
};

export default createReducer(initialState, {
  [selectChannelAction]: (state, { payload }) => {
    state.activeMainContent = {
      type: 'channel',
      id: payload.id,
    };
  },
  [selectPrivateMessageAction]: (state, { payload }) => {
    state.activeMainContent = {
      type: 'message',
      id: payload.id,
    };
  },

  [unselectMainContentAction]: (state, _) => {
    state.activeMainContent = null;
  },
  [toggleCreateChannelModalAction]: (state, _) => {
    state.isModalOpen = !state.isModalOpen;
  },

  [toggleRenameChannelModalAction]: (state, _) => {
    state.isModalOpen = !state.isModalOpen;
  },

  [toggleDeleteChannelModalAction]: (state, _) => {
    state.isModalOpen = !state.isModalOpen;
  },

  [toggleDeleteMessagingModalAction]: (state, _) => {
    state.isModalOpen = !state.isModalOpen;
  },

  [toggleProfileSettingsModal]: (state, _) => {
    state.isModalOpen = !state.isModalOpen;
  },
});
