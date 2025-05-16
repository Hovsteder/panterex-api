const commissionsService = require('../services/commissionService');

/**
 * Контроллер для управления комиссиями
 */

// Получение всех комиссий
const getAllCommissions = async (req, res) => {
  try {
    const commissions = await commissionsService.getAllCommissions();
    res.json({
      status: 'success',
      data: commissions
    });
  } catch (error) {
    console.error('Ошибка при получении комиссий:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при получении комиссий'
    });
  }
};

// Получение комиссий для конкретной валюты
const getCommissionsByCurrency = async (req, res) => {
  try {
    const { currency } = req.params;
    const commissions = await commissionsService.getCommissionsByCurrency(currency.toUpperCase());
    
    res.json({
      status: 'success',
      data: commissions
    });
  } catch (error) {
    console.error(`Ошибка при получении комиссий для валюты ${req.params.currency}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при получении комиссий'
    });
  }
};

// Создание новой комиссии
const createCommission = async (req, res) => {
  try {
    const { currency, min_amount, max_amount, commission_percent } = req.body;
    
    // Проверка обязательных полей
    if (!currency || !min_amount || !commission_percent) {
      return res.status(400).json({
        status: 'error',
        message: 'Необходимо указать валюту, минимальную сумму и процент комиссии'
      });
    }
    
    // Валидация данных
    if (min_amount < 0 || (max_amount && max_amount < min_amount) || commission_percent < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Некорректные значения для комиссии'
      });
    }
    
    // Создание комиссии
    const newCommission = await commissionsService.createCommission({
      currency: currency.toUpperCase(),
      min_amount: parseFloat(min_amount),
      max_amount: max_amount ? parseFloat(max_amount) : null,
      commission_percent: parseFloat(commission_percent)
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Комиссия успешно создана',
      data: newCommission
    });
  } catch (error) {
    console.error('Ошибка при создании комиссии:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при создании комиссии'
    });
  }
};

// Обновление комиссии
const updateCommission = async (req, res) => {
  try {
    const { id } = req.params;
    const { min_amount, max_amount, commission_percent } = req.body;
    
    // Проверяем, существует ли комиссия
    const existingCommission = await commissionsService.getCommissionById(Number(id));
    if (!existingCommission) {
      return res.status(404).json({
        status: 'error',
        message: 'Комиссия не найдена'
      });
    }
    
    // Валидация данных
    if ((min_amount && min_amount < 0) || 
        (max_amount && max_amount < 0) || 
        (min_amount && max_amount && max_amount < min_amount) || 
        (commission_percent && commission_percent < 0)) {
      return res.status(400).json({
        status: 'error',
        message: 'Некорректные значения для комиссии'
      });
    }
    
    // Подготавливаем данные для обновления
    const updateData = {};
    if (min_amount !== undefined) updateData.min_amount = parseFloat(min_amount);
    if (max_amount !== undefined) updateData.max_amount = max_amount !== null ? parseFloat(max_amount) : null;
    if (commission_percent !== undefined) updateData.commission_percent = parseFloat(commission_percent);
    
    // Обновляем комиссию
    const updatedCommission = await commissionsService.updateCommission(Number(id), updateData);
    
    res.json({
      status: 'success',
      message: 'Комиссия успешно обновлена',
      data: updatedCommission
    });
  } catch (error) {
    console.error(`Ошибка при обновлении комиссии с ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при обновлении комиссии'
    });
  }
};

// Удаление комиссии
const deleteCommission = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Проверяем, существует ли комиссия
    const existingCommission = await commissionsService.getCommissionById(Number(id));
    if (!existingCommission) {
      return res.status(404).json({
        status: 'error',
        message: 'Комиссия не найдена'
      });
    }
    
    // Удаляем комиссию
    const result = await commissionsService.deleteCommission(Number(id));
    
    if (result) {
      res.json({
        status: 'success',
        message: 'Комиссия успешно удалена'
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Ошибка при удалении комиссии'
      });
    }
  } catch (error) {
    console.error(`Ошибка при удалении комиссии с ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при удалении комиссии'
    });
  }
};

module.exports = {
  getAllCommissions,
  getCommissionsByCurrency,
  createCommission,
  updateCommission,
  deleteCommission
};