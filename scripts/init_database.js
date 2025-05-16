/**
 * Скрипт для инициализации базы данных SQLite
 * 
 * Выполните этот скрипт при первом запуске приложения или
 * при необходимости сбросить базу данных и создать заново:
 * node scripts/init_database.js
 */

const db = require('../src/utils/db');
const fs = require('fs');
const path = require('path');

// Путь к директории с базой данных
const dbDir = path.join(__dirname, '..', 'db');

// Создаем директорию, если она не существует
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`Создана директория: ${dbDir}`);
}

// Инициализация таблиц
function initTables() {
  // Создание таблицы пользователей
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      email TEXT,
      role TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `).run();
  
  // Создание таблицы комиссий
  db.prepare(`
    CREATE TABLE IF NOT EXISTS commissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      currency TEXT NOT NULL,
      min_amount REAL NOT NULL,
      max_amount REAL,
      commission_percent REAL NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `).run();
  
  // Создание таблицы конфигурации
  db.prepare(`
    CREATE TABLE IF NOT EXISTS config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `).run();
  
  // Создание таблицы истории курсов
  db.prepare(`
    CREATE TABLE IF NOT EXISTS rates_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_currency TEXT NOT NULL,
      to_currency TEXT NOT NULL,
      rate REAL NOT NULL,
      source TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `).run();
  
  // Создание таблицы истории трекинга
  db.prepare(`
    CREATE TABLE IF NOT EXISTS tracking_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT,
      short_client_id TEXT,
      event_name TEXT NOT NULL,
      event_data TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_term TEXT,
      utm_content TEXT,
      page_url TEXT,
      referrer TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `).run();
  
  console.log('Таблицы успешно созданы');
}

// Добавление начальных данных
function seedInitialData() {
  // Добавление пользователей по умолчанию, если их нет
  const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  
  if (usersCount === 0) {
    db.prepare(`
      INSERT INTO users (username, password, name, role, email)
      VALUES (?, ?, ?, ?, ?)
    `).run('admin', 'admin123', 'Администратор', 'admin', 'admin@panterex.online');
    
    db.prepare(`
      INSERT INTO users (username, password, name, role, email)
      VALUES (?, ?, ?, ?, ?)
    `).run('manager', 'manager123', 'Менеджер', 'manager', 'manager@panterex.online');
    
    console.log('Добавлены пользователи по умолчанию');
  }
  
  // Добавление настроек конфигурации по умолчанию
  const configCount = db.prepare('SELECT COUNT(*) as count FROM config').get().count;
  
  if (configCount === 0) {
    const defaultConfig = [
      { key: 'MIN_THB_LIMIT', value: '3200', description: 'Минимальная сумма обмена в THB' },
      { key: 'MIN_RUB_LIMIT', value: '10000', description: 'Минимальная сумма обмена в RUB' },
      { key: 'MIN_USDT_LIMIT', value: '100', description: 'Минимальная сумма обмена в USDT' },
      { key: 'THB_ORDER_AMOUNT', value: '10000', description: 'Стандартная сумма ордера для THB' },
      { key: 'RUB_ORDER_AMOUNT', value: '30000', description: 'Стандартная сумма ордера для RUB' },
      { key: 'DEFAULT_COMMISSION', value: '1.0', description: 'Комиссия по умолчанию (%)' },
      { key: 'CACHE_TIMEOUT_API', value: '300', description: 'Время кэширования API в секундах' },
      { key: 'SITE_NAME', value: 'PanterEx', description: 'Название сайта' },
      { key: 'ADMIN_CONTACT_EMAIL', value: 'admin@panterex.online', description: 'Email администратора' }
    ];
    
    const insertStmt = db.prepare(`
      INSERT INTO config (key, value, description)
      VALUES (?, ?, ?)
    `);
    
    defaultConfig.forEach(config => {
      insertStmt.run(config.key, config.value, config.description);
    });
    
    console.log('Добавлены настройки конфигурации по умолчанию');
  }
  
  // Добавление комиссий по умолчанию
  const commissionsCount = db.prepare('SELECT COUNT(*) as count FROM commissions').get().count;
  
  if (commissionsCount === 0) {
    const defaultCommissions = [
      // RUB комиссии
      { currency: 'RUB', min_amount: 0, max_amount: 5000, commission_percent: 9.0 },
      { currency: 'RUB', min_amount: 5000, max_amount: 10000, commission_percent: 7.0 },
      { currency: 'RUB', min_amount: 10000, max_amount: 30000, commission_percent: 5.0 },
      { currency: 'RUB', min_amount: 30000, max_amount: 100000, commission_percent: 3.5 },
      { currency: 'RUB', min_amount: 100000, max_amount: null, commission_percent: 2.5 },
      
      // THB комиссии
      { currency: 'THB', min_amount: 0, max_amount: 5000, commission_percent: 8.0 },
      { currency: 'THB', min_amount: 5000, max_amount: 10000, commission_percent: 6.0 },
      { currency: 'THB', min_amount: 10000, max_amount: 30000, commission_percent: 4.0 },
      { currency: 'THB', min_amount: 30000, max_amount: 100000, commission_percent: 3.0 },
      { currency: 'THB', min_amount: 100000, max_amount: null, commission_percent: 2.0 },
      
      // USDT комиссии
      { currency: 'USDT', min_amount: 0, max_amount: 100, commission_percent: 5.0 },
      { currency: 'USDT', min_amount: 100, max_amount: 500, commission_percent: 3.0 },
      { currency: 'USDT', min_amount: 500, max_amount: 1000, commission_percent: 2.0 },
      { currency: 'USDT', min_amount: 1000, max_amount: 5000, commission_percent: 1.5 },
      { currency: 'USDT', min_amount: 5000, max_amount: null, commission_percent: 1.0 }
    ];
    
    const insertStmt = db.prepare(`
      INSERT INTO commissions (currency, min_amount, max_amount, commission_percent)
      VALUES (?, ?, ?, ?)
    `);
    
    defaultCommissions.forEach(commission => {
      insertStmt.run(
        commission.currency,
        commission.min_amount,
        commission.max_amount,
        commission.commission_percent
      );
    });
    
    console.log('Добавлены комиссии по умолчанию');
  }
}

console.log('Инициализация базы данных...');

try {
  // Инициализируем таблицы
  initTables();
  
  // Добавляем начальные данные
  seedInitialData();
  
  console.log('База данных успешно инициализирована');
} catch (error) {
  console.error('Ошибка при инициализации базы данных:', error);
  process.exit(1);
}