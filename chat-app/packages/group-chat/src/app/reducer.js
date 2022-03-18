import { combineReducers } from 'redux';
// import homeReducer from './scenes/Home/reducer';
import workspaceReducer from './scenes/Workspace/reducer';

// Import all other reducers here and use combineReducers
// to import the root reducer. This app only has one.

// export default combineReducers({workspaceReducer});
export default workspaceReducer;
