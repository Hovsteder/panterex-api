const userService = require('../services/userService');

/**
 * Контроллер для управления пользователями
 */

// Получение списка всех пользователей
const getAllUsers = async (req, res) => {
  try {
    const users = userService.getAllUsers();
    res.json({
      status: 'success',
      data: users
    });
  } catch (error) {
    console.error('Ошибка при получении списка пользователей:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при получении списка пользователей'
    });
  }
};

// Получение информации о пользователе по ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = userService.getUserById(Number(id));
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Пользователь не найден'
      });
    }
    
    res.json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error(`Ошибка при получении пользователя с ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при получении информации о пользователе'
    });
  }
};

// Создание нового пользователя
const createUser = async (req, res) => {
  try {
    const { username, password, name, email, role } = req.body;
    
    // Проверка обязательных полей
    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Необходимо указать имя пользователя и пароль'
      });
    }
    
    // Проверка на существование пользователя с таким именем
    const existingUser = userService.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Пользователь с таким именем уже существует'
      });
    }
    
    // Создание пользователя
    const newUser = userService.createUser({
      username,
      password,
      name: name || username,
      email: email || '',
      role: role || 'manager' // По умолчанию - менеджер
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Пользователь успешно создан',
      data: newUser
    });
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при создании пользователя'
    });
  }
};

// Обновление данных пользователя
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    
    // Проверяем, существует ли пользователь
    const existingUser = userService.getUserById(Number(id));
    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: 'Пользователь не найден'
      });
    }
    
    // Подготавливаем данные для обновления
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) updateData.password = password;
    
    // Обновляем пользователя
    const updatedUser = userService.updateUser(Number(id), updateData);
    
    res.json({
      status: 'success',
      message: 'Данные пользователя успешно обновлены',
      data: updatedUser
    });
  } catch (error) {
    console.error(`Ошибка при обновлении пользователя с ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при обновлении данных пользователя'
    });
  }
};

// Удаление пользователя
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Проверяем, существует ли пользователь
    const existingUser = userService.getUserById(Number(id));
    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: 'Пользователь не найден'
      });
    }
    
    // Запрещаем удалять последнего администратора
    if (existingUser.role === 'admin') {
      const admins = userService.getAllUsers().filter(user => user.role === 'admin');
      if (admins.length <= 1) {
        return res.status(400).json({
          status: 'error',
          message: 'Невозможно удалить последнего администратора'
        });
      }
    }
    
    // Удаляем пользователя
    const result = userService.deleteUser(Number(id));
    
    if (result) {
      res.json({
        status: 'success',
        message: 'Пользователь успешно удален'
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Ошибка при удалении пользователя'
      });
    }
  } catch (error) {
    console.error(`Ошибка при удалении пользователя с ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при удалении пользователя'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};