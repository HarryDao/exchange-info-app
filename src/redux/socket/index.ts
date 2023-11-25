import { createSlice, createAction } from '@reduxjs/toolkit';

import type { AppState } from '../store';

const ENTITY = 'socket';

const socketIsConnecting = createAction(`${ENTITY}/socketIsConnecting`);
const socketIsReady = createAction(`${ENTITY}/socketIsReady`);
const socketIsDisconnected = createAction(`${ENTITY}/socketIsDisconnected`);

export interface SocketState {
  isReady: boolean;
  isError: boolean;
}

const initialState: SocketState = {
  isReady: false,
  isError: false,
};

const slice = createSlice({
  name: ENTITY,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(socketIsConnecting, () => ({
        isReady: false,
        isError: false,
      }))
      .addCase(socketIsReady, () => ({
        isReady: true,
        isError: false,
      }))
      .addCase(socketIsDisconnected, () => ({
        isReady: false,
        isError: true,
      })),
});

const isSocketReady = (app: AppState) => app.socket.isReady;
const isSocketError = (app: AppState) => app.socket.isError;

export const socketActions = {
  socketIsReady,
  socketIsDisconnected,
  socketIsConnecting,
};

export const socketSelectors = {
  isSocketReady,
  isSocketError,
};

export const socketReducer = slice.reducer;
