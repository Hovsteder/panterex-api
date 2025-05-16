const db = require('../utils/db');

/**
 * Сервис для работы с историей курсов валют
 */

// Сохранение курсов в историю
const saveRatesHistory = async (ratesData) => {
  try {
    const timestamp = new Date().toISOString();
    
    // Сохраняем THB/USDT
    if (ratesData.thb_usdt) {
      db.prepare(
        `INSERT INTO rates_history (from_currency, to_currency, rate, source, created_at) 
        VALUES (?, ?, ?, ?, ?)`
      ).run('THB', 'USDT', ratesData.thb_usdt, 'Bitkub API', timestamp);
    }
    
    // Сохраняем USDT/RUB
    if (ratesData.usdt_rub) {
      db.prepare(
        `INSERT INTO rates_history (from_currency, to_currency, rate, source, created_at) 
        VALUES (?, ?, ?, ?, ?)`
      ).run('USDT', 'RUB', ratesData.usdt_rub, 'Bybit P2P API', timestamp);
    }
    
    // Сохраняем THB/RUB (кросс-курс)
    if (ratesData.thb_rub) {
      db.prepare(
        `INSERT INTO rates_history (from_currency, to_currency, rate, source, created_at) 
        VALUES (?, ?, ?, ?, ?)`
      ).run('THB', 'RUB', ratesData.thb_rub, 'Cross-calculated', timestamp);
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении истории курсов:', error);
    return false;
  }
};

// Получение истории курсов валют с пагинацией и фильтрацией
const getRatesHistory = async (params) => {
  try {
    const { limit, offset, from, to, currency_pair } = params;
    
    // Базовый SQL-запрос
    let sql = `SELECT * FROM rates_history`;
    const whereConditions = [];
    const sqlParams = [];
    
    // Добавляем фильтр по валютной паре
    if (currency_pair) {
      const [fromCurrency, toCurrency] = currency_pair.split('_');
      whereConditions.push(`from_currency = ? AND to_currency = ?`);
      sqlParams.push(fromCurrency.toUpperCase(), toCurrency.toUpperCase());
    }
    
    // Добавляем фильтр по временному периоду
    if (from) {
      whereConditions.push(`created_at >= ?`);
      sqlParams.push(from.toISOString());
    }
    
    if (to) {
      whereConditions.push(`created_at <= ?`);
      sqlParams.push(to.toISOString());
    }
    
    // Собираем полный запрос с условиями WHERE
    if (whereConditions.length > 0) {
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    // Добавляем сортировку по времени (от новых к старым)
    sql += ` ORDER BY created_at DESC`;
    
    // Подсчитываем общее количество записей
    let countSql = `SELECT COUNT(*) as total FROM rates_history`;
    if (whereConditions.length > 0) {
      countSql += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    const totalCount = db.prepare(countSql).get(...sqlParams).total;
    
    // Добавляем пагинацию
    sql += ` LIMIT ? OFFSET ?`;
    sqlParams.push(limit, offset);
    
    // Выполняем запрос
    const data = db.prepare(sql).all(...sqlParams);
    
    return {
      data,
      total: totalCount
    };
  } catch (error) {
    console.error('Ошибка при получении истории курсов:', error);
    throw error;
  }
};

module.exports = {
  saveRatesHistory,
  getRatesHistory
};