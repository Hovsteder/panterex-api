import api from './api';

const authService = {
  // Авторизация пользователя
  login: (credentials) => {
    return api.post('/api/auth/login', credentials);
  },
  
  // Выход
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Получение токена
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  // Проверка срока действия токена (для дополнительной безопасности)
  isTokenValid: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Упрощенная проверка - в реальном приложении используйте jwt-decode или аналогичную библиотеку
      // В этой заглушке просто проверяем наличие токена
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default authService;