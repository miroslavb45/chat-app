import { createAction } from '@reduxjs/toolkit';

export default function createWsAction(actionName, successActionsName) {
  const success = createAction(`${successActionsName}`);
  const error = createAction(`${actionName}_ERROR`);

  const action = createAction(`WS_${actionName}`, (payload) => ({
    payload: {
      success,
      error,
      payload,
      name: actionName,
      needsResponse: successActionsName ? true : false,
    },
  }));

  return { action, success, error };
}
