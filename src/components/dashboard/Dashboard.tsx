import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as AttachMoneyIcon,
  Receipt as ReceiptIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

// Mock data for demo purposes
const recentTransactions = [
  { id: 1, type: 'income', description: 'Client Payment', amount: 1250.00, date: '2025-04-20' },
  { id: 2, type: 'expense', description: 'Office Supplies', amount: 120.50, date: '2025-04-19' },
  { id: 3, type: 'income', description: 'Consulting Services', amount: 850.00, date: '2025-04-18' },
  { id: 4, type: 'expense', description: 'Software Subscription', amount: 29.99, date: '2025-04-15' }
];

// Mock budget data
const budgetData = [
  { category: 'Rent', allocated: 1200, spent: 1200, percentage: 100 },
  { category: 'Utilities', allocated: 300, spent: 220, percentage: 73 },
  { category: 'Marketing', allocated: 500, spent: 350, percentage: 70 },
  { category: 'Software', allocated: 200, spent: 190, percentage: 95 }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  const totalIncome = 21500.00;
  const totalExpenses = 15200.00;
  const balance = totalIncome - totalExpenses;
  const previousBalance = 5100.00;
  const balanceChange = ((balance - previousBalance) / previousBalance) * 100;
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.username}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Here's what's happening with your accounts today.
      </Typography>
      
      {/* Financial Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                    TOTAL BALANCE
                  </Typography>
                  <Typography variant="h4" component="div">
                    ${balance.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AccountBalanceIcon />
                </Avatar>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                {balanceChange >= 0 ? (
                  <>
                    <TrendingUpIcon fontSize="small" color="success" />
                    <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                      +{balanceChange.toFixed(1)}%
                    </Typography>
                  </>
                ) : (
                  <>
                    <TrendingDownIcon fontSize="small" color="error" />
                    <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                      {balanceChange.toFixed(1)}%
                    </Typography>
                  </>
                )}
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                    TOTAL INCOME
                  </Typography>
                  <Typography variant="h4" component="div">
                    ${totalIncome.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <AttachMoneyIcon />
                </Avatar>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUpIcon fontSize="small" color="success" />
                <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                  +12.5%
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                    TOTAL EXPENSES
                  </Typography>
                  <Typography variant="h4" component="div">
                    ${totalExpenses.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <ReceiptIcon />
                </Avatar>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingDownIcon fontSize="small" color="error" />
                <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                  +8.2%
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                    PENDING INVOICES
                  </Typography>
                  <Typography variant="h4" component="div">
                    $3,450.00
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <ShoppingCartIcon />
                </Avatar>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <Typography variant="body2" color="textSecondary">
                  5 invoices pending
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Main Dashboard Content */}
      <Grid container spacing={3}>
        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {recentTransactions.map((transaction) => (
                <ListItem
                  key={transaction.id}
                  alignItems="flex-start"
                  sx={{ borderBottom: '1px solid #f0f0f0', py: 1 }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: transaction.type === 'income' ? 'success.light' : 'error.light',
                        color: transaction.type === 'income' ? 'success.contrastText' : 'error.contrastText'
                      }}
                    >
                      {transaction.type === 'income' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={transaction.description}
                    secondary={transaction.date}
                  />
                  <Typography 
                    variant="body2" 
                    color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    ${transaction.amount.toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                View all transactions
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Budget Overview */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Budget Overview
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {budgetData.map((budget) => (
                <ListItem key={budget.category} sx={{ px: 0 }}>
                  <Box sx={{ width: '100%' }}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">{budget.category}</Typography>
                      <Typography variant="body2">
                        ${budget.spent} / ${budget.allocated}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={budget.percentage} 
                      color={
                        budget.percentage < 70 ? 'success' : 
                        budget.percentage < 90 ? 'warning' : 'error'
                      }
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Box display="flex" justifyContent="space-between" mt={0.5}>
                      <Typography variant="caption" color="textSecondary">
                        {budget.percentage}% used
                      </Typography>
                      <Chip
                        label={budget.percentage === 100 ? "Complete" : "In Progress"}
                        size="small"
                        color={budget.percentage === 100 ? "primary" : "default"}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                Manage budgets
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;