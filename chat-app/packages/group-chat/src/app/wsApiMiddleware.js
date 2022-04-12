import { store } from './app';
import { getActiveWsConnection } from './shared/services/websocket';

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  return function (next) {
    return async function (action) {
      const isWsAction = action.type.startsWith('WS');

      if (isWsAction) {
        const ws = getActiveWsConnection();
        if (ws) {
          let responseReceived;
          const listener = (payload) => {
            responseReceived = true;
            store.dispatch(action.payload.success(payload));
          };

          ws.emit(action.payload.name, action.payload.payload);
          //console.log(action.payload.name + ' message sent.');

          if (action.payload.needsResponse) {
            //console.log('Needs response branch');
            ws.once(action.payload.success, listener);

            // We wait for the response action for 2s
            try {
              await new Promise((res, rej) =>
                setTimeout(() => {
                  if (responseReceived) {
                    res();
                  } else {
                    rej(`Haven't received [${action.payload.success}] message in 2 seconds`);
                  }
                }, 2000)
              );
            } catch (error) {
              store.dispatch(action.payload.error(error));
            }
          }
        }
      }

      return next(action);
    };
  };
}
