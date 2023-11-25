import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from 'src/apis';
import { ENDPOINTS } from 'src/configs';
import { DataConfig } from 'src/types';
import type { AppState } from '../store';

const ENTITY = 'data-configs';

export interface DataConfigsState {
  configs: DataConfig[];
  loading: boolean;
  error: boolean;
}

const initialState: DataConfigsState = {
  configs: [],
  loading: true,
  error: false,
};

const fetchDataConfigs = createAsyncThunk(
  `${ENTITY}/fetchDataConfigs`,
  async () => {
    const res = await apiClient.get<{ data: DataConfig[] }>(
      `${ENDPOINTS.dataConfigs}`,
    );
    return res.data.data;
  },
);

const slice = createSlice({
  name: ENTITY,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchDataConfigs.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchDataConfigs.rejected, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchDataConfigs.fulfilled, (state, action) => {
        state.configs = action.payload;
        state.loading = false;
        state.error = false;
      }),
});

export const dataConfigsReducer = slice.reducer;
export const dataConfigsActions = {
  fetchDataConfigs,
};
export const dataConfigsSelectors = {
  getDataConfigs: (state: AppState) => state.dataConfigs.configs,
  getLoading: (state: AppState) => state.dataConfigs.loading,
  getError: (state: AppState) => state.dataConfigs.error,
};
