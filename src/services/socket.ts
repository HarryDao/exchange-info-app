import openSocketIO, { Socket } from 'socket.io-client';
import url from 'url';

import { ENVS } from 'src/constants';
import { SocketEventEnum, SocketNewData } from 'src/types';
import { Root } from 'src/Root';
import { socketActions } from 'src/redux/socket';
import { currentPricesActions } from 'src/redux/currentPrices';

export const getSocket = (() => {
  let socket: Socket | undefined;
  let initializing: Promise<Socket> | undefined;

  const onConnecting = () => {
    Root.getStore().dispatch(socketActions.socketIsConnecting());
  };

  const onDisconnect = () => {
    Root.getStore().dispatch(socketActions.socketIsDisconnected());
  };

  const onConnected = () => {
    Root.getStore().dispatch(socketActions.socketIsReady());
  };

  const onNewData = (data: SocketNewData) => {
    Root.getStore().dispatch(currentPricesActions.updateCurrentPrices(data));
  };

  const init = () => {
    initializing = new Promise((resolve) => {
      const { protocol, host, path } = url.parse(ENVS.server);
      const newSocket = openSocketIO(`${protocol}//${host}`, {
        path: `${path || ''}/socket.io`,
      });

      onConnecting();

      // Connected
      newSocket.on(SocketEventEnum.connect, () => {
        socket = newSocket;
        initializing = undefined;

        onConnected();
        resolve(newSocket);
      });
      newSocket.on(SocketEventEnum.reconnect, onConnected);

      // Connecting
      newSocket.on(SocketEventEnum.reconnecting, onConnecting);

      // Error
      newSocket.on(SocketEventEnum.disconnect, onDisconnect);
      newSocket.on(SocketEventEnum.error, onDisconnect);
      newSocket.on(SocketEventEnum.reconnect_error, onDisconnect);
      newSocket.on(SocketEventEnum.reconnect_failed, onDisconnect);

      // Data
      newSocket.on(SocketEventEnum.newData, onNewData);
    });

    return initializing;
  };

  return async () => {
    if (socket) return socket;

    const newSocket = await (initializing || init());
    return newSocket;
  };
})();
