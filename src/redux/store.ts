import {
  AnyAction,
  DeepPartial,
  ThunkDispatch,
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { DataConfigsState } from './dataConfigs';

import storage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';

import { dataConfigsReducer } from './dataConfigs';
import { CurrentPricesState, currentPricesReducer } from './currentPrices';
import { SocketState, socketReducer } from './socket';
import {
  ShortHistoricalState,
  shortHistoricalReducer,
} from './shortHistorical';
import { LongHistoricalState, longHistoricalReducer } from './longHistorical';
import { MoreInfoState, moreInfoReducer } from './moreInfo';

export interface AppState {
  dataConfigs: DataConfigsState;
  currentPrices: CurrentPricesState;
  socket: SocketState;
  shortHistorical: ShortHistoricalState;
  longHistorical: LongHistoricalState;
  moreInfo: MoreInfoState;
}

export type AppDispatch = ThunkDispatch<AppState, any, AnyAction>;

const persistConfigs = {
  key: 'v1.0',
  storage,
};

export const createStore = (initialState?: AppState) => {
  const reducer = combineReducers({
    dataConfigs: dataConfigsReducer,
    currentPrices: currentPricesReducer,
    socket: socketReducer,
    shortHistorical: shortHistoricalReducer,
    longHistorical: longHistoricalReducer,
    moreInfo: moreInfoReducer,
  });

  const persistedReducer = persistReducer(persistConfigs, reducer);

  // Todo: remove this on production
  storage.clear();

  return configureStore({
    reducer: persistedReducer,
    preloadedState: initialState || {},
    middleware: getDefaultMiddleware({
      serializableCheck: false,
    }),
  });
};

export default createStore();
