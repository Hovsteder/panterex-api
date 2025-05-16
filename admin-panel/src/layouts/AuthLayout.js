import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Box, Paper, Typography } from '@mui/material';

function AuthLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Если пользователь авторизован и находится на странице логина,
    // перенаправляем его на главную страницу
    if (isAuthenticated && location.pathname === '/login') {
      navigate('/');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
          }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            PanterEx
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Административная панель
          </Typography>
          <Outlet />
        </Paper>
      </Box>
    </Container>
  );
}

export default AuthLayout;