import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { apiClient } from 'src/apis';
import { ENDPOINTS } from 'src/configs';
import { Candle, HistoricalData } from 'src/types';
import type { AppState } from '../store';

const ENTITY = 'long-historical';

const fetchLongHistoricalData = createAsyncThunk<Candle[], string>(
  `${ENTITY}/fetchLongHistoricalData`,
  async (symbol) => {
    const res = await apiClient.get<{ data: Candle[] }>(
      `${ENDPOINTS.historyLongTime}?symbol=${symbol}`,
    );
    return res.data.data;
  },
);

interface LongHistorical {
  data: Candle[];
  loading: boolean;
  error: any;
}

export interface LongHistoricalState {
  symbols: {
    [symbol: string]: LongHistorical;
  };
}

const initialState: LongHistoricalState = {
  symbols: {},
};

const slice = createSlice({
  name: ENTITY,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchLongHistoricalData.pending, (state, action) => {
        state.symbols[action.meta.arg] = {
          data: state.symbols[action.meta.arg]?.data || [],
          loading: true,
          error: null,
        };
      })
      .addCase(fetchLongHistoricalData.rejected, (state, action) => {
        state.symbols[action.meta.arg] = {
          data: state.symbols[action.meta.arg]?.data || [],
          loading: false,
          error: action.error,
        };
      })
      .addCase(fetchLongHistoricalData.fulfilled, (state, action) => {
        state.symbols[action.meta.arg] = {
          data: action.payload,
          loading: false,
          error: null,
        };
      }),
});

export const longHistoricalReducer = slice.reducer;

export const longHistoricalActions = {
  fetchLongHistoricalData,
};

export const longHistoricalSelectors = {
  selectAllLongHistoricalData: (state: AppState) => state.longHistorical,
  selectLongHistoricalDataFor1Symbol: (state: AppState, symbol: string) => {
    return state.longHistorical.symbols[symbol];
  },
};
