const express = require('express');
const router = express.Router();

// Импорт маршрутов
const exchangeRoutes = require('./exchangeRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const ratesRoutes = require('./ratesRoutes');
const commissionsRoutes = require('./commissionsRoutes');
const configRoutes = require('./configRoutes');
const analyticsRoutes = require('./analyticsRoutes');

// API-версия и базовый путь
const API_VERSION = 'v1';
const BASE_PATH = '/api';

// Роуты для обмена валюты
router.use(`${BASE_PATH}/exchange`, exchangeRoutes);

// Роуты для аутентификации
router.use(`${BASE_PATH}/auth`, authRoutes);

// Роуты для пользователей (защищены middleware авторизации)
router.use(`${BASE_PATH}/users`, userRoutes);

// Роуты для курсов валют
router.use(`${BASE_PATH}/rates`, ratesRoutes);

// Роуты для комиссий
router.use(`${BASE_PATH}/commissions`, commissionsRoutes);

// Роуты для настроек
router.use(`${BASE_PATH}/config`, configRoutes);

// Роуты для аналитики
router.use(`${BASE_PATH}/analytics`, analyticsRoutes);

// Маршрут для проверки работоспособности API
router.get(`${BASE_PATH}/health`, (req, res) => {
  res.json({
    status: 'success',
    message: 'PanterEx API работает',
    version: API_VERSION,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;