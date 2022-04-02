import { combineReducers } from 'redux';
// import homeReducer from './scenes/Home/reducer';
import workspaceReducer from './scenes/Workspace/reducer';
import homeReducer from './scenes/Home/reducer';
import channelReducer from './scenes/Home/components/Channel/reducer';
import messagingReducer from './scenes/Home/components/PrivateMessage/reducer';

// Import all other reducers here and use combineReducers
// to import the root reducer. This app only has one.

export default combineReducers({
  workspace: workspaceReducer,
  home: homeReducer,
  channel: channelReducer,
  messaging: messagingReducer,
});
// export default workspaceReducer;
