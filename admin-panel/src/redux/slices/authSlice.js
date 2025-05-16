import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Асинхронный экшен для входа
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка аутентификации');
    }
  }
);

// Асинхронный экшен для выхода
export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout();
});

const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // В случае, если токен истек или был признан недействительным сервером
    unauthorize: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Обработка logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { clearError, unauthorize } = authSlice.actions;
export default authSlice.reducer;