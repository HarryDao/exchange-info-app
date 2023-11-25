import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from 'src/apis';
import { ENDPOINTS } from 'src/configs';
import { Current, CurrentData, SocketNewData } from 'src/types';
import type { AppState } from '../store';

const ENTITY = 'current-prices';

const fetchCurrentPrices = createAsyncThunk<CurrentData>(
  `${ENTITY}/fetchCurrentPrices`,
  async () => {
    const res = await apiClient.get<{ data: CurrentData }>(
      ENDPOINTS.currentData,
    );

    return res.data.data;
  },
);

const updateCurrentPrices = createAction<SocketNewData>(
  `${ENTITY}/updateCurrentPrices`,
);

export interface CurrentPricesState {
  data: CurrentData;
  loading: boolean;
  error: boolean;
}

const initialState: CurrentPricesState = {
  data: {},
  loading: true,
  error: false,
};

const slice = createSlice({
  name: ENTITY,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchCurrentPrices.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchCurrentPrices.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchCurrentPrices.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = false;
      })
      .addCase(updateCurrentPrices, (state, action) => {
        state.data[action.payload.symbol] = {
          ...(state.data[action.payload.symbol] || {}),
          price: action.payload.price,
          time: action.payload.time,
        };
      }),
});

export const currentPricesActions = {
  fetchCurrentPrices,
  updateCurrentPrices,
};

export const currentPricesSelectors = {
  getLoading: (state: AppState) => state.currentPrices.loading,
  getError: (state: AppState) => state.currentPrices.error,
  getAllCurrentPrices: (state: AppState) => state.currentPrices.data,
  getCurrentPriceForSymbols: (state: AppState, ...symbols: string[]) => {
    const { data } = state.currentPrices;
    const results: CurrentData = {};
    symbols.forEach((symbol) => {
      if (data[symbol]) results[symbol] = data[symbol];
    });
    return results;
  },
  getCurrentPriceFor1Symbol: (state: AppState, symbol: string) => {
    return state.currentPrices.data[symbol];
  },
};

export const currentPricesReducer = slice.reducer;
