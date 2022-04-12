import { getAuth } from 'firebase/auth';
import { store } from './app';

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  return function (next) {
    return async function (action) {
      const isRestAction = action.type.startsWith('REQUEST');

      const baseUrl = 'api.localhost';

      if (isRestAction) {
        const auth = getAuth();
        const jwt = await auth?.currentUser?.getIdToken();

        if (jwt) {
          const { url, method, queryParams } = action.payload;
          const serializedQueryParams = new URLSearchParams(queryParams);
          const apiUrl = `http://${baseUrl}/api/${url}${serializedQueryParams ? `?${serializedQueryParams}` : ''}`;

          const options = {
            method: method,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          };
          fetch(apiUrl, options)
            .then((response) => response.json())
            .catch(() => {})
            .then((payload) => {
              if (payload.error) {
                store.dispatch(action.payload.error(payload.error));
              } else {
                store.dispatch(action.payload.success(payload));
              }
            })
            .catch((err) => {
              store.dispatch(action.payload.error(err));
            });
        }
      }

      return next(action);
    };
  };
}
