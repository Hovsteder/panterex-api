import api from './api';

const ratesService = {
  // Получение актуальных курсов валют
  getRates: () => {
    return api.get('/api/rates');
  },
  
  // Принудительное обновление курсов (сброс кэша)
  refreshRates: () => {
    return api.post('/api/rates/refresh');
  },
  
  // Получение истории курсов
  getRatesHistory: (params) => {
    return api.get('/api/rates/history', { params });
  },
};

export default ratesService;