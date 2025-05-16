import api from './api';

const configService = {
  // Получение всех настроек конфигурации
  getAllConfig: () => {
    return api.get('/api/config');
  },
  
  // Получение конкретной настройки по ключу
  getConfigByKey: (key) => {
    return api.get(`/api/config/${key}`);
  },
  
  // Обновление настройки
  updateConfig: (key, configData) => {
    return api.put(`/api/config/${key}`, configData);
  },
  
  // Создание новой настройки
  createConfig: (configData) => {
    return api.post('/api/config', configData);
  },
  
  // Удаление настройки
  deleteConfig: (key) => {
    return api.delete(`/api/config/${key}`);
  }
};

export default configService;