import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Rates from './pages/Rates';
import Commissions from './pages/Commissions';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Analytics from './pages/Analytics';

// Проверка аутентификации
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      {/* Авторизация */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
      </Route>
      
      {/* Основной интерфейс (защищенный) */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="rates" element={<Rates />} />
        <Route path="commissions" element={<Commissions />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users" element={<Users />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
      
      {/* Перенаправление для несуществующих маршрутов */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;