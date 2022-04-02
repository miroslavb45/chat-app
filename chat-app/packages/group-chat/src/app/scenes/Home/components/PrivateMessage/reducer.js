import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  availableUsers: [],
  activeMessaging: null,
};

export default createReducer(initialState, {});
