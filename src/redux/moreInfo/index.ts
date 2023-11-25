import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { apiClient } from 'src/apis';
import { ENDPOINTS } from 'src/configs';
import { Candle, HistoricalData, MoreInfo } from 'src/types';
import type { AppState } from '../store';

const ENTITY = 'more-info';

const fetchMoreInfoData = createAsyncThunk<MoreInfo, string>(
  `${ENTITY}/fetchMoreInfoData`,
  async (symbol) => {
    const res = await apiClient.get<{ data: MoreInfo }>(
      `${ENDPOINTS.moreInfo}?symbol=${symbol}`,
    );
    return res.data.data;
  },
);

export interface MoreInfoState {
  symbols: {
    [symbol: string]: {
      data: MoreInfo;
      loading: boolean;
      error: any;
    };
  };
}

const initialState: MoreInfoState = {
  symbols: {},
};

const slice = createSlice({
  name: ENTITY,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchMoreInfoData.pending, (state, action) => {
        state.symbols[action.meta.arg] = {
          data: state.symbols[action.meta.arg]?.data || [],
          loading: true,
          error: null,
        };
      })
      .addCase(fetchMoreInfoData.rejected, (state, action) => {
        state.symbols[action.meta.arg] = {
          data: state.symbols[action.meta.arg]?.data || [],
          loading: false,
          error: action.error,
        };
      })
      .addCase(fetchMoreInfoData.fulfilled, (state, action) => {
        state.symbols[action.meta.arg] = {
          data: action.payload,
          loading: false,
          error: null,
        };
      }),
});

export const moreInfoReducer = slice.reducer;

export const moreInfoActions = {
  fetchMoreInfoData,
};

export const moreInfoSelectors = {
  selectAllMoreInfoData: (state: AppState) => state.moreInfo,
  selectMoreInfoDataFor1Symbol: (state: AppState, symbol: string) =>
    state.moreInfo.symbols[symbol],
};
