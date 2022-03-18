import { getAuth } from 'firebase/auth';
import { store } from './app';

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  return function (next) {
    return async function (action) {
      const isRestAction = action.type.startsWith('REQUEST');

      if (isRestAction) {

        const auth = getAuth();
        const jwt = await auth?.currentUser?.getIdToken();

        if (jwt) {
          console.log(action)

          const { url, method, queryParams } = action.payload;
          const serializedQueryParams = new URLSearchParams(queryParams);
          const apiUrl = `http://api.localhost/api/${url}${serializedQueryParams ? `?${serializedQueryParams}`  : ''}`;

          const options = {
            method: method,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          };
          fetch(apiUrl, options)
            .then((response) => response.json()).catch(() => { })
            .then((payload) => {
              store.dispatch(action.payload.success(payload));
            })
            .catch((err) => {
              console.log(err)
              store.dispatch(action.payload.error(err));
            });
        }
      }

      return next(action);
    };
  };
}
