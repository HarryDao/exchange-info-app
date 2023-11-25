import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from 'src/apis';
import { ENDPOINTS } from 'src/configs';
import { DataTypeEnum, HistoricalData } from 'src/types';
import type { AppState } from '../store';

const ENTITY = 'short-historical';

const fetchShortHistoricalData = createAsyncThunk<HistoricalData, string[]>(
  `${ENTITY}/fetchShortHistoricalData`,
  async (symbols) => {
    const res = await apiClient.get<{ data: HistoricalData }>(
      `${ENDPOINTS.historyShortTime}?symbols=${symbols.join(',')}`,
    );
    return res.data.data;
  },
);

export interface ShortHistoricalState {
  data: HistoricalData;
  loading: boolean;
  error: any;
}

const initialState: ShortHistoricalState = {
  data: {},
  loading: false,
  error: null,
};

const slice = createSlice({
  name: ENTITY,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchShortHistoricalData.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShortHistoricalData.fulfilled, (state, action) => {
        Object.entries(action.payload).forEach(([symbol, symbolData]) => {
          state.data[symbol] = symbolData;
        });
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchShortHistoricalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      }),
});

export const shortHistoricalReducer = slice.reducer;

export const shortHistoricalActions = {
  fetchShortHistoricalData,
};

export const shortHistoricalSelectors = {
  getAllShortHistoricalData: (state: AppState) => state.shortHistorical.data,
  getShortHistoricalLoading: (state: AppState) => state.shortHistorical.loading,
  getShortHistoricalError: (state: AppState) => state.shortHistorical.error,
  getShortHistoricalFor1Symbol: (state: AppState, symbol: string) => {
    return state.shortHistorical.data[symbol];
  },
};
