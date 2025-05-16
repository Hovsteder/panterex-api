const express = require('express');
const router = express.Router();
const commissionsController = require('../controllers/commissionsController');
const authController = require('../controllers/authController');

/**
 * @route GET /api/commissions
 * @desc Получение всех комиссий
 * @access Public
 */
router.get('/', commissionsController.getAllCommissions);

/**
 * @route GET /api/commissions/:currency
 * @desc Получение комиссий для конкретной валюты
 * @access Public
 */
router.get('/:currency', commissionsController.getCommissionsByCurrency);

/**
 * @route POST /api/commissions
 * @desc Добавление новой комиссии
 * @access Private (только для администраторов)
 */
router.post(
  '/',
  authController.verifyToken,
  authController.checkRole(['admin']),
  commissionsController.createCommission
);

/**
 * @route PUT /api/commissions/:id
 * @desc Обновление комиссии по ID
 * @access Private (только для администраторов)
 */
router.put(
  '/:id',
  authController.verifyToken,
  authController.checkRole(['admin']),
  commissionsController.updateCommission
);

/**
 * @route DELETE /api/commissions/:id
 * @desc Удаление комиссии
 * @access Private (только для администраторов)
 */
router.delete(
  '/:id',
  authController.verifyToken,
  authController.checkRole(['admin']),
  commissionsController.deleteCommission
);

module.exports = router;