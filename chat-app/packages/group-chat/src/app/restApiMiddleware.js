import { getAuth } from 'firebase/auth';
import { store } from './app';

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  return function (next) {
    return async function (action) {
      const isRestAction = action.type.startsWith('REQUEST');

      if (isRestAction) {
        const auth = getAuth();
        const jwt = await auth.currentUser.getIdToken();

        if (jwt) {
          const { url, method } = action.payload;
          const apiUrl = `http://api.localhost/api/${url}`;

          const options = {
            method: method,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          };
          fetch(apiUrl, options)
            .then((response) => response.json())
            .then((payload) => {
              store.dispatch(action.payload.success(payload));
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
