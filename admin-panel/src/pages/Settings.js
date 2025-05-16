import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { fetchConfig, updateConfig } from '../redux/slices/configSlice';

function Settings() {
  const dispatch = useDispatch();
  const { data: configData, loading, error } = useSelector((state) => state.config);
  
  // Локальное состояние для хранения измененных значений
  const [editedValues, setEditedValues] = useState({});
  // Состояние для отображения сообщений об успешном сохранении
  const [savedMessages, setSavedMessages] = useState({});
  
  // Загрузка данных конфигурации при монтировании компонента
  useEffect(() => {
    dispatch(fetchConfig());
  }, [dispatch]);
  
  // Обработка изменения полей
  const handleChange = (key, value) => {
    setEditedValues(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Сбрасываем сообщение об успешном сохранении при изменении поля
    if (savedMessages[key]) {
      setSavedMessages(prev => ({
        ...prev,
        [key]: false
      }));
    }
  };
  
  // Сохранение конкретной настройки
  const handleSave = (key) => {
    if (editedValues[key] !== undefined) {
      dispatch(updateConfig({ key, value: editedValues[key] }))
        .then(() => {
          // При успешном сохранении показываем сообщение
          setSavedMessages(prev => ({
            ...prev,
            [key]: true
          }));
          
          // Скрываем сообщение через 3 секунды
          setTimeout(() => {
            setSavedMessages(prev => ({
              ...prev,
              [key]: false
            }));
          }, 3000);
        });
    }
  };
  
  // Обновление всех настроек
  const handleRefresh = () => {
    dispatch(fetchConfig());
    setEditedValues({});
    setSavedMessages({});
  };
  
  // Группируем настройки по категориям
  const categorizeSettings = () => {
    if (!configData) return {};
    
    const categories = {
      limits: [],
      orders: [],
      system: [],
      other: []
    };
    
    configData.forEach(config => {
      if (config.key.includes('LIMIT')) {
        categories.limits.push(config);
      } else if (config.key.includes('ORDER')) {
        categories.orders.push(config);
      } else if (['CACHE_TIMEOUT', 'DEFAULT_COMMISSION', 'SITE_NAME', 'ADMIN_CONTACT'].some(term => config.key.includes(term))) {
        categories.system.push(config);
      } else {
        categories.other.push(config);
      }
    });
    
    return categories;
  };
  
  const categorizedSettings = categorizeSettings();
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Настройки</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Обновить
        </Button>
      </Box>
      
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
          {/* Лимиты обмена */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Минимальные суммы обмена" />
              <Divider />
              <CardContent>
                {categorizedSettings.limits?.map(config => (
                  <Box key={config.key} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label={config.description || config.key}
                      value={editedValues[config.key] !== undefined ? editedValues[config.key] : config.value}
                      onChange={(e) => handleChange(config.key, e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleSave(config.key)}
                              disabled={editedValues[config.key] === undefined || editedValues[config.key] === config.value}
                              color="primary"
                            >
                              <SaveIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      helperText={savedMessages[config.key] ? "Сохранено!" : " "}
                      FormHelperTextProps={{
                        sx: { color: savedMessages[config.key] ? 'success.main' : 'inherit' }
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Стандартные суммы ордеров */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Стандартные суммы ордеров" />
              <Divider />
              <CardContent>
                {categorizedSettings.orders?.map(config => (
                  <Box key={config.key} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label={config.description || config.key}
                      value={editedValues[config.key] !== undefined ? editedValues[config.key] : config.value}
                      onChange={(e) => handleChange(config.key, e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleSave(config.key)}
                              disabled={editedValues[config.key] === undefined || editedValues[config.key] === config.value}
                              color="primary"
                            >
                              <SaveIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      helperText={savedMessages[config.key] ? "Сохранено!" : " "}
                      FormHelperTextProps={{
                        sx: { color: savedMessages[config.key] ? 'success.main' : 'inherit' }
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Системные настройки */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Системные настройки" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  {categorizedSettings.system?.map(config => (
                    <Grid item xs={12} md={6} key={config.key}>
                      <TextField
                        fullWidth
                        label={config.description || config.key}
                        value={editedValues[config.key] !== undefined ? editedValues[config.key] : config.value}
                        onChange={(e) => handleChange(config.key, e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title="Сохранить изменения">
                                <IconButton
                                  onClick={() => handleSave(config.key)}
                                  disabled={editedValues[config.key] === undefined || editedValues[config.key] === config.value}
                                  color="primary"
                                >
                                  <SaveIcon />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                        helperText={savedMessages[config.key] ? "Сохранено!" : " "}
                        FormHelperTextProps={{
                          sx: { color: savedMessages[config.key] ? 'success.main' : 'inherit' }
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Прочие настройки */}
          {categorizedSettings.other?.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Прочие настройки" />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    {categorizedSettings.other?.map(config => (
                      <Grid item xs={12} md={6} key={config.key}>
                        <TextField
                          fullWidth
                          label={config.description || config.key}
                          value={editedValues[config.key] !== undefined ? editedValues[config.key] : config.value}
                          onChange={(e) => handleChange(config.key, e.target.value)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => handleSave(config.key)}
                                  disabled={editedValues[config.key] === undefined || editedValues[config.key] === config.value}
                                  color="primary"
                                >
                                  <SaveIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          helperText={savedMessages[config.key] ? "Сохранено!" : " "}
                          FormHelperTextProps={{
                            sx: { color: savedMessages[config.key] ? 'success.main' : 'inherit' }
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default Settings;