import axios from 'axios';
import { store } from '../redux/store';
import { unauthorize } from '../redux/slices/authSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик запросов
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Добавляем перехватчик ответов
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Если ответ 401 Unauthorized, выходим из системы
    if (error.response && error.response.status === 401) {
      store.dispatch(unauthorize());
    }
    return Promise.reject(error);
  }
);

export default api;