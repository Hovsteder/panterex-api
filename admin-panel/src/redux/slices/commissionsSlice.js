import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commissionsService from '../../services/commissionsService';

// Асинхронный экшен для получения комиссий
export const fetchCommissions = createAsyncThunk(
  'commissions/fetchCommissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await commissionsService.getAllCommissions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при получении комиссий');
    }
  }
);

// Асинхронный экшен для создания комиссии
export const createCommission = createAsyncThunk(
  'commissions/createCommission',
  async (commissionData, { rejectWithValue }) => {
    try {
      const response = await commissionsService.createCommission(commissionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при создании комиссии');
    }
  }
);

// Асинхронный экшен для обновления комиссии
export const updateCommission = createAsyncThunk(
  'commissions/updateCommission',
  async ({ id, commissionData }, { rejectWithValue }) => {
    try {
      const response = await commissionsService.updateCommission(id, commissionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при обновлении комиссии');
    }
  }
);

// Асинхронный экшен для удаления комиссии
export const deleteCommission = createAsyncThunk(
  'commissions/deleteCommission',
  async (id, { rejectWithValue }) => {
    try {
      await commissionsService.deleteCommission(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при удалении комиссии');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null
};

const commissionsSlice = createSlice({
  name: 'commissions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchCommissions
      .addCase(fetchCommissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommissions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCommissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработка createCommission
      .addCase(createCommission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCommission.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data) {
          state.data.push(action.payload);
        } else {
          state.data = [action.payload];
        }
      })
      .addCase(createCommission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработка updateCommission
      .addCase(updateCommission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCommission.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data) {
          const index = state.data.findIndex(commission => commission.id === action.payload.id);
          if (index !== -1) {
            state.data[index] = action.payload;
          }
        }
      })
      .addCase(updateCommission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработка deleteCommission
      .addCase(deleteCommission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCommission.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data) {
          state.data = state.data.filter(commission => commission.id !== action.payload);
        }
      })
      .addCase(deleteCommission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = commissionsSlice.actions;
export default commissionsSlice.reducer;