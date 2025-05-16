import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { fetchCommissions, createCommission, updateCommission, deleteCommission } from '../redux/slices/commissionsSlice';

function Commissions() {
  const dispatch = useDispatch();
  const { data: commissions, loading, error } = useSelector((state) => state.commissions);
  
  const [currentTab, setCurrentTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCommission, setEditingCommission] = useState(null);
  const [formData, setFormData] = useState({
    currency: 'RUB',
    min_amount: '',
    max_amount: '',
    commission_percent: ''
  });
  
  // Загрузка комиссий при монтировании компонента
  useEffect(() => {
    dispatch(fetchCommissions());
  }, [dispatch]);
  
  // Обработка смены вкладки
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  // Открытие диалога для создания новой комиссии
  const handleAddCommission = () => {
    setEditingCommission(null);
    setFormData({
      currency: getCurrencyFromTab(),
      min_amount: '',
      max_amount: '',
      commission_percent: ''
    });
    setDialogOpen(true);
  };
  
  // Открытие диалога для редактирования комиссии
  const handleEditCommission = (commission) => {
    setEditingCommission(commission);
    setFormData({
      currency: commission.currency,
      min_amount: commission.min_amount.toString(),
      max_amount: commission.max_amount ? commission.max_amount.toString() : '',
      commission_percent: commission.commission_percent.toString()
    });
    setDialogOpen(true);
  };
  
  // Обработка удаления комиссии
  const handleDeleteCommission = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту комиссию?')) {
      dispatch(deleteCommission(id));
    }
  };
  
  // Обработка изменения полей формы
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Обработка отправки формы
  const handleSubmit = () => {
    const formattedData = {
      ...formData,
      min_amount: parseFloat(formData.min_amount),
      max_amount: formData.max_amount ? parseFloat(formData.max_amount) : null,
      commission_percent: parseFloat(formData.commission_percent)
    };
    
    if (editingCommission) {
      dispatch(updateCommission({ id: editingCommission.id, commissionData: formattedData }));
    } else {
      dispatch(createCommission(formattedData));
    }
    
    setDialogOpen(false);
  };
  
  // Обновление данных
  const handleRefresh = () => {
    dispatch(fetchCommissions());
  };
  
  // Получение валюты из текущей вкладки
  const getCurrencyFromTab = () => {
    switch (currentTab) {
      case 0: return 'RUB';
      case 1: return 'THB';
      case 2: return 'USDT';
      default: return 'RUB';
    }
  };
  
  // Фильтрация комиссий по текущей валюте
  const filteredCommissions = commissions?.filter(
    commission => commission.currency === getCurrencyFromTab()
  ) || [];
  
  // Сортировка по минимальной сумме
  const sortedCommissions = [...filteredCommissions].sort(
    (a, b) => a.min_amount - b.min_amount
  );
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Комиссии</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ mr: 2 }}
            disabled={loading}
          >
            Обновить
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCommission}
            disabled={loading}
          >
            Добавить комиссию
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Настройка комиссий для разных валют и диапазонов сумм
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Комиссии применяются в зависимости от валюты и суммы обмена. Для разных диапазонов могут быть установлены разные проценты комиссии.
          </Typography>
        </CardContent>
      </Card>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="RUB" />
          <Tab label="THB" />
          <Tab label="USDT" />
        </Tabs>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Минимальная сумма</TableCell>
                <TableCell>Максимальная сумма</TableCell>
                <TableCell>Комиссия (%)</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedCommissions.length > 0 ? (
                sortedCommissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell>{commission.min_amount.toLocaleString('ru-RU')} {commission.currency}</TableCell>
                    <TableCell>
                      {commission.max_amount ? commission.max_amount.toLocaleString('ru-RU') : 'Без ограничений'} 
                      {commission.max_amount ? ` ${commission.currency}` : ''}
                    </TableCell>
                    <TableCell>{commission.commission_percent}%</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditCommission(commission)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteCommission(commission.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Нет настроенных комиссий для {getCurrencyFromTab()}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Диалог создания/редактирования комиссии */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCommission ? 'Редактирование комиссии' : 'Создание новой комиссии'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Валюта</InputLabel>
                  <Select
                    name="currency"
                    value={formData.currency}
                    onChange={handleFormChange}
                    label="Валюта"
                    disabled={editingCommission}
                  >
                    <MenuItem value="RUB">RUB</MenuItem>
                    <MenuItem value="THB">THB</MenuItem>
                    <MenuItem value="USDT">USDT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Минимальная сумма"
                  name="min_amount"
                  type="number"
                  value={formData.min_amount}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Максимальная сумма (пусто для 'без ограничений')"
                  name="max_amount"
                  type="number"
                  value={formData.max_amount}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Комиссия (%)"
                  name="commission_percent"
                  type="number"
                  value={formData.commission_percent}
                  onChange={handleFormChange}
                  required
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={
              !formData.min_amount || 
              !formData.commission_percent ||
              (formData.max_amount && parseFloat(formData.max_amount) <= parseFloat(formData.min_amount))
            }
          >
            {editingCommission ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Commissions;