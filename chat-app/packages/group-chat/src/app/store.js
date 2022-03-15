import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';
import thunk from 'redux-thunk';
import restApiMiddleware from './restApiMiddleware';

const apiMiddlewareOpts = {};

// eslint-disable-next-line
if (process.env.REACT_APP_ENABLE_MIDDLEWARE_LOGGING) {
  apiMiddlewareOpts.enableTracing = true;
}

let baseURL = 'http://api.localhost/api';
// eslint-disable-next-line
if (process.env.REACT_APP_BASE_URL) {
  // eslint-disable-next-line
  baseURL = process.env.REACT_APP_BASE_URL;
}

// const apiMiddleware = configureApiMiddleware({baseURL}, apiMiddlewareOpts);

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [restApiMiddleware, thunk],
    preloadedState,
  });
  // eslint-disable-next-line
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducer', () => store.replaceReducer(rootReducer));
  }
  return store;
}
