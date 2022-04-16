import { combineReducers } from 'redux';
import channelReducer from './scenes/Home/components/Channel/reducer';
import messagingReducer from './scenes/Home/components/Messaging/reducer';
import homeReducer from './scenes/Home/reducer';
import workspaceReducer from './scenes/Workspace/reducer';
import userReducer from './shared/reducers/User/reducer';
import videoChatReducer from './scenes/VideoChat/reducer';

// Import all other reducers here and use combineReducers
// to import the root reducer. This app only has one.

export default combineReducers({
  workspace: workspaceReducer,
  home: homeReducer,
  channel: channelReducer,
  messaging: messagingReducer,
  user: userReducer,
  videoChat: videoChatReducer,
});
// export default workspaceReducer;
