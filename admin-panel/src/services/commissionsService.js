import api from './api';

const commissionsService = {
  // Получение всех комиссий
  getAllCommissions: () => {
    return api.get('/api/commissions');
  },
  
  // Получение комиссий для конкретной валюты
  getCommissionsByCurrency: (currency) => {
    return api.get(`/api/commissions/${currency}`);
  },
  
  // Создание новой комиссии
  createCommission: (commissionData) => {
    return api.post('/api/commissions', commissionData);
  },
  
  // Обновление комиссии
  updateCommission: (id, commissionData) => {
    return api.put(`/api/commissions/${id}`, commissionData);
  },
  
  // Удаление комиссии
  deleteCommission: (id) => {
    return api.delete(`/api/commissions/${id}`);
  }
};

export default commissionsService;