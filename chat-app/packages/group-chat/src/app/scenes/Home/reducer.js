import { createReducer } from '@reduxjs/toolkit';

import { selectChannelAction, selectPrivateMessageAction, unselectMainContentAction } from './actions';
import { toggleCreateChannelModalAction } from './components/Channel/components/CreateChannelModal/actions';
import { toggleDeleteChannelModalAction } from './components/Channel/components/DeleteChannelModal/actions';
import { toggleRenameChannelModalAction } from './components/Channel/components/RenameChannelModal/actions';

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
  
  [unselectMainContentAction]: (state, { payload }) => {
    state.activeMainContent = null
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
});
