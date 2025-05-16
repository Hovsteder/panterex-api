const bitkubService = require('../services/bitkubService');
const bybitService = require('../services/bybitService');
const ratesService = require('../services/ratesService');

/**
 * Контроллер для управления курсами валют
 */

// Получение текущих курсов валют
const getRates = async (req, res) => {
  try {
    // Получаем курсы из разных источников
    const bitkubData = await bitkubService.getThbUsdtRate();
    const bybitData = await bybitService.getRubUsdtRate();
    
    // Рассчитываем кросс-курс THB/RUB
    const thbRubRate = bitkubData.thb_usdt / bybitData.usdt_rub;
    
    // Формируем объект с данными
    const ratesData = {
      thb_usdt: bitkubData.thb_usdt,
      usdt_rub: bybitData.usdt_rub,
      rub_usdt: bybitData.rub_usdt,
      thb_rub: thbRubRate,
      last_updated: new Date().toISOString(),
      sources: {
        thb_usdt: 'Bitkub API',
        usdt_rub: 'Bybit P2P API'
      }
    };
    
    // Сохраняем курсы в историю, если они изменились
    await ratesService.saveRatesHistory(ratesData);
    
    res.json({
      status: 'success',
      data: ratesData
    });
  } catch (error) {
    console.error('Ошибка при получении курсов валют:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при получении курсов валют',
      error: error.message
    });
  }
};

// Принудительное обновление курсов валют (сброс кэша)
const refreshRates = async (req, res) => {
  try {
    // Сбрасываем кэш для Bitkub
    await bitkubService.clearCache();
    
    // Сбрасываем кэш для Bybit
    await bybitService.clearCache();
    
    // Получаем обновленные курсы
    const bitkubData = await bitkubService.getThbUsdtRate();
    const bybitData = await bybitService.getRubUsdtRate();
    
    // Рассчитываем кросс-курс THB/RUB
    const thbRubRate = bitkubData.thb_usdt / bybitData.usdt_rub;
    
    // Формируем объект с данными
    const ratesData = {
      thb_usdt: bitkubData.thb_usdt,
      usdt_rub: bybitData.usdt_rub,
      rub_usdt: bybitData.rub_usdt,
      thb_rub: thbRubRate,
      last_updated: new Date().toISOString(),
      sources: {
        thb_usdt: 'Bitkub API',
        usdt_rub: 'Bybit P2P API'
      }
    };
    
    // Сохраняем курсы в историю
    await ratesService.saveRatesHistory(ratesData);
    
    res.json({
      status: 'success',
      message: 'Курсы валют успешно обновлены',
      data: ratesData
    });
  } catch (error) {
    console.error('Ошибка при обновлении курсов валют:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при обновлении курсов валют',
      error: error.message
    });
  }
};

// Получение истории изменения курсов валют
const getRatesHistory = async (req, res) => {
  try {
    // Получаем параметры для пагинации и фильтрации
    const { limit = 100, offset = 0, from, to, currency_pair } = req.query;
    
    // Подготавливаем параметры запроса
    const params = {
      limit: parseInt(limit),
      offset: parseInt(offset)
    };
    
    // Добавляем временной период, если указан
    if (from) params.from = new Date(from);
    if (to) params.to = new Date(to);
    
    // Добавляем фильтр по валютной паре, если указан
    if (currency_pair) params.currency_pair = currency_pair;
    
    // Получаем историю курсов
    const history = await ratesService.getRatesHistory(params);
    
    res.json({
      status: 'success',
      data: history.data,
      pagination: {
        total: history.total,
        limit: params.limit,
        offset: params.offset
      }
    });
  } catch (error) {
    console.error('Ошибка при получении истории курсов валют:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при получении истории курсов валют',
      error: error.message
    });
  }
};

module.exports = {
  getRates,
  refreshRates,
  getRatesHistory
};