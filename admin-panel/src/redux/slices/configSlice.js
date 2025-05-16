import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import configService from '../../services/configService';

// Асинхронный экшен для получения всех настроек
export const fetchConfig = createAsyncThunk(
  'config/fetchConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await configService.getAllConfig();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при получении настроек');
    }
  }
);

// Асинхронный экшен для обновления настройки
export const updateConfig = createAsyncThunk(
  'config/updateConfig',
  async ({ key, value, description }, { rejectWithValue }) => {
    try {
      const configData = { value };
      if (description !== undefined) {
        configData.description = description;
      }
      
      const response = await configService.updateConfig(key, configData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при обновлении настройки');
    }
  }
);

// Асинхронный экшен для создания новой настройки
export const createConfig = createAsyncThunk(
  'config/createConfig',
  async (configData, { rejectWithValue }) => {
    try {
      const response = await configService.createConfig(configData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при создании настройки');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchConfig
      .addCase(fetchConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработка updateConfig
      .addCase(updateConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConfig.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data) {
          const index = state.data.findIndex(config => config.key === action.payload.key);
          if (index !== -1) {
            state.data[index] = action.payload;
          }
        }
      })
      .addCase(updateConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработка createConfig
      .addCase(createConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConfig.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data) {
          state.data.push(action.payload);
        } else {
          state.data = [action.payload];
        }
      })
      .addCase(createConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = configSlice.actions;
export default configSlice.reducer;