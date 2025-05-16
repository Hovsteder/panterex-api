import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ratesService from '../../services/ratesService';

// Асинхронный экшен для получения текущих курсов
export const fetchRates = createAsyncThunk(
  'rates/fetchRates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ratesService.getRates();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при получении курсов');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const ratesSlice = createSlice({
  name: 'rates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ratesSlice.reducer;