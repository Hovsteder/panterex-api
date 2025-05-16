import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { fetchRates } from '../redux/slices/ratesSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const { data: rates, loading, lastUpdated } = useSelector((state) => state.rates);

  useEffect(() => {
    dispatch(fetchRates());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Дашборд
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Обзор ключевых показателей и информации
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Карточка текущих курсов */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Текущие курсы
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {rates ? (
                    <Box>
                      <Typography variant="body1">
                        THB/USDT: {rates.thb_usdt?.toFixed(2) || 'н/д'}
                      </Typography>
                      <Typography variant="body1">
                        RUB/USDT: {rates.rub_usdt?.toFixed(2) || 'н/д'}
                      </Typography>
                      <Typography variant="body1">
                        THB/RUB: {rates.thb_rub?.toFixed(4) || 'н/д'}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      Нет данных
                    </Typography>
                  )}
                  {lastUpdated && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      Последнее обновление: {new Date(lastUpdated).toLocaleString()}
                    </Typography>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Карточка статистики */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Статистика обменов
              </Typography>
              {/* Здесь будут данные о количестве обменов, когда подключим эту функциональность */}
              <Typography color="text.secondary">
                Статистика загружается...
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Карточка конфигурации */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Текущие лимиты
              </Typography>
              <Typography variant="body1">
                Минимальный лимит THB: 3200 THB
              </Typography>
              <Typography variant="body1">
                Минимальный лимит RUB: 10000 RUB
              </Typography>
              <Typography variant="body1">
                Минимальный лимит USDT: 100 USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Карточка информации о системе */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Информация о системе
              </Typography>
              <Typography variant="body1">
                Версия API: 1.0.0
              </Typography>
              <Typography variant="body1">
                Админ-панель: 0.1.0
              </Typography>
              <Typography variant="body1">
                Статус системы: Активна
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;