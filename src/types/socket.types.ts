export enum SocketEventEnum {
  connect = 'connect',
  reconnect = 'reconnect',
  reconnecting = 'reconnecting',
  error = 'error',
  disconnect = 'disconnect',
  reconnect_error = 'reconnect_error',
  reconnect_failed = 'reconnect_failed',
  newData = 'new-data',
  data = 'data',
}

export interface SocketNewData {
  symbol: string;
  price: number;
  time: number;
}
