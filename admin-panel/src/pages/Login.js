import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { login, clearError } from '../redux/slices/authSlice';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Очищаем ошибку при размонтировании или при изменении ввода
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (error) dispatch(clearError());
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="username"
        label="Имя пользователя"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={handleUsernameChange}
        disabled={loading}
      />

      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Пароль"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={handlePasswordChange}
        disabled={loading}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Войти'}
      </Button>

      <Typography variant="body2" color="text.secondary" align="center">
        Для входа используйте учетные данные, предоставленные администратором.
      </Typography>
    </Box>
  );
}

export default Login;