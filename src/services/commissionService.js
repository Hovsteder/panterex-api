const db = require('../utils/db');

/**
 * Сервис для работы с комиссиями
 */

// Получение всех комиссий
const getAllCommissions = async () => {
  try {
    const commissions = db.prepare(`SELECT * FROM commissions ORDER BY currency, min_amount`).all();
    return commissions;
  } catch (error) {
    console.error('Ошибка при получении комиссий:', error);
    throw error;
  }
};

// Получение комиссии по ID
const getCommissionById = async (id) => {
  try {
    const commission = db.prepare(`SELECT * FROM commissions WHERE id = ?`).get(id);
    return commission || null;
  } catch (error) {
    console.error(`Ошибка при получении комиссии с ID ${id}:`, error);
    throw error;
  }
};

// Получение комиссий для конкретной валюты
const getCommissionsByCurrency = async (currency) => {
  try {
    const commissions = db.prepare(
      `SELECT * FROM commissions WHERE currency = ? ORDER BY min_amount`
    ).all(currency);
    return commissions;
  } catch (error) {
    console.error(`Ошибка при получении комиссий для валюты ${currency}:`, error);
    throw error;
  }
};

// Создание новой комиссии
const createCommission = async (commissionData) => {
  try {
    const { currency, min_amount, max_amount, commission_percent } = commissionData;
    
    const result = db.prepare(
      `INSERT INTO commissions (currency, min_amount, max_amount, commission_percent, created_at, updated_at) 
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`
    ).run(currency, min_amount, max_amount, commission_percent);
    
    if (result.changes > 0) {
      return getCommissionById(result.lastInsertRowid);
    }
    
    throw new Error('Не удалось создать комиссию');
  } catch (error) {
    console.error('Ошибка при создании комиссии:', error);
    throw error;
  }
};

// Обновление комиссии
const updateCommission = async (id, updateData) => {
  try {
    // Получаем текущие данные комиссии
    const currentCommission = await getCommissionById(id);
    if (!currentCommission) {
      throw new Error('Комиссия не найдена');
    }
    
    // Формируем SQL-запрос для обновления
    let sql = `UPDATE commissions SET updated_at = datetime('now')`;
    const params = [];
    
    // Добавляем поля для обновления
    if (updateData.min_amount !== undefined) {
      sql += `, min_amount = ?`;
      params.push(updateData.min_amount);
    }
    
    if (updateData.max_amount !== undefined) {
      sql += `, max_amount = ?`;
      params.push(updateData.max_amount);
    }
    
    if (updateData.commission_percent !== undefined) {
      sql += `, commission_percent = ?`;
      params.push(updateData.commission_percent);
    }
    
    // Добавляем условие WHERE
    sql += ` WHERE id = ?`;
    params.push(id);
    
    // Выполняем запрос
    const result = db.prepare(sql).run(...params);
    
    if (result.changes > 0) {
      return getCommissionById(id);
    }
    
    throw new Error('Не удалось обновить комиссию');
  } catch (error) {
    console.error(`Ошибка при обновлении комиссии с ID ${id}:`, error);
    throw error;
  }
};

// Удаление комиссии
const deleteCommission = async (id) => {
  try {
    const result = db.prepare(`DELETE FROM commissions WHERE id = ?`).run(id);
    return result.changes > 0;
  } catch (error) {
    console.error(`Ошибка при удалении комиссии с ID ${id}:`, error);
    throw error;
  }
};

// Получение комиссии для конкретной суммы и валюты
const getCommissionForAmount = async (currency, amount) => {
  try {
    const commissions = await getCommissionsByCurrency(currency);
    
    // Если комиссий нет, используем значение по умолчанию
    if (!commissions || commissions.length === 0) {
      return 1.0; // 1% по умолчанию
    }
    
    // Находим подходящую комиссию по сумме
    for (const commission of commissions) {
      if (amount >= commission.min_amount && 
          (commission.max_amount === null || amount <= commission.max_amount)) {
        return commission.commission_percent;
      }
    }
    
    // Если не найдено подходящей комиссии, используем последнюю (с наибольшей min_amount)
    return commissions[commissions.length - 1].commission_percent;
  } catch (error) {
    console.error(`Ошибка при получении комиссии для суммы ${amount} ${currency}:`, error);
    // В случае ошибки возвращаем значение по умолчанию
    return 1.0;
  }
};

module.exports = {
  getAllCommissions,
  getCommissionById,
  getCommissionsByCurrency,
  createCommission,
  updateCommission,
  deleteCommission,
  getCommissionForAmount
};