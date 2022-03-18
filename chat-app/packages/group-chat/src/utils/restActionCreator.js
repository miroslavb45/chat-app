import { createAction } from '@reduxjs/toolkit';

export default function createRestAction(actionName, url, method) {
  const success = createAction(`${actionName}_SUCCESS`);
  const error = createAction(`${actionName}_ERROR`);

  const action = createAction(`REQUEST_${actionName}`, (queryParams) => ({
    payload: {
      url,
      method,
      success,
      error,
      queryParams,
    },
  }));

  return { action, success, error };
}
