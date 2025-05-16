import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Tooltip,
  IconButton,
  Alert,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { fetchRates } from '../redux/slices/ratesSlice';
import ratesService from '../services/ratesService';

function Rates() {
  const dispatch = useDispatch();
  const { data: rates, loading, error, lastUpdated } = useSelector((state) => state.rates);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(null);

  useEffect(() => {
    if (!rates) {
      dispatch(fetchRates());
    }
  }, [dispatch, rates]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshError(null);
    try {
      await ratesService.refreshRates();
      dispatch(fetchRates());
    } catch (error) {
      setRefreshError(error.response?.data?.message || 'Ошибка при обновлении курсов');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Курсы валют</Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading || refreshing}
        >
          {refreshing ? 'Обновление...' : 'Обновить'}
        </Button>
      </Box>

      {refreshError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {refreshError}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Основная таблица курсов */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Текущие курсы валют
                </Typography>
                {lastUpdated && (
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    Последнее обновление: {new Date(lastUpdated).toLocaleString()}
                  </Typography>
                )}
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Валютная пара</TableCell>
                        <TableCell align="right">Курс</TableCell>
                        <TableCell>Источник</TableCell>
                        <TableCell>Статус</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rates ? (
                        <>
                          <TableRow>
                            <TableCell>THB/USDT</TableCell>
                            <TableCell align="right">{rates.thb_usdt?.toFixed(2) || 'н/д'}</TableCell>
                            <TableCell>Bitkub API</TableCell>
                            <TableCell>
                              <Typography color="success.main">Активен</Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>RUB/USDT</TableCell>
                            <TableCell align="right">{rates.rub_usdt?.toFixed(2) || 'н/д'}</TableCell>
                            <TableCell>Bybit P2P API</TableCell>
                            <TableCell>
                              <Typography color="success.main">Активен</Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>THB/RUB (кросс-курс)</TableCell>
                            <TableCell align="right">{rates.thb_rub?.toFixed(4) || 'н/д'}</TableCell>
                            <TableCell>Рассчитан</TableCell>
                            <TableCell>
                              <Typography color="success.main">Активен</Typography>
                            </TableCell>
                          </TableRow>
                        </>
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            Нет данных
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Дополнительная информация о настройках курсов */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Информация об источниках данных
                </Typography>
                <Typography variant="body2" paragraph>
                  Курсы THB/USDT получаются с биржи Bitkub через официальный API. Обновление происходит автоматически каждые 5 минут.
                </Typography>
                <Typography variant="body2" paragraph>
                  Курсы RUB/USDT получаются с P2P-площадки Bybit через API. Данные агрегируются и рассчитывается средний курс по лучшим предложениям.
                </Typography>
                <Typography variant="body2">
                  Кросс-курс THB/RUB рассчитывается на основе курсов THB/USDT и RUB/USDT.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Rates;