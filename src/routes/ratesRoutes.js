const express = require('express');
const router = express.Router();
const ratesController = require('../controllers/ratesController');
const authController = require('../controllers/authController');

/**
 * @route GET /api/rates
 * @desc Получение текущих курсов валют
 * @access Public
 */
router.get('/', ratesController.getRates);

/**
 * @route POST /api/rates/refresh
 * @desc Принудительное обновление курсов валют (сброс кэша)
 * @access Private (только для авторизованных пользователей)
 */
router.post(
  '/refresh', 
  authController.verifyToken,
  ratesController.refreshRates
);

/**
 * @route GET /api/rates/history
 * @desc Получение истории изменения курсов валют
 * @access Private (только для авторизованных пользователей)
 */
router.get(
  '/history',
  authController.verifyToken,
  ratesController.getRatesHistory
);

module.exports = router;