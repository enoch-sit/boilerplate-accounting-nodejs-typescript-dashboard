import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { User, UserRole } from '../../types/auth';

// Mock user data for demo purposes
const mockUsers: User[] = [
  {
    _id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    isVerified: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    lastLogin: '2023-04-22T10:30:00.000Z',
    status: 'active'
  },
  {
    _id: '2',
    username: 'supervisor1',
    email: 'supervisor@example.com',
    role: 'supervisor',
    isVerified: true,
    createdAt: '2023-02-15T00:00:00.000Z',
    updatedAt: '2023-02-15T00:00:00.000Z',
    lastLogin: '2023-04-21T14:45:00.000Z',
    status: 'active'
  },
  {
    _id: '3',
    username: 'user1',
    email: 'user1@example.com',
    role: 'enduser',
    isVerified: true,
    createdAt: '2023-03-10T00:00:00.000Z',
    updatedAt: '2023-03-10T00:00:00.000Z',
    lastLogin: '2023-04-20T09:15:00.000Z',
    status: 'active'
  },
  {
    _id: '4',
    username: 'user2',
    email: 'user2@example.com',
    role: 'enduser',
    isVerified: false,
    createdAt: '2023-04-01T00:00:00.000Z',
    updatedAt: '2023-04-01T00:00:00.000Z',
    status: 'inactive'
  },
  {
    _id: '5',
    username: 'user3',
    email: 'user3@example.com',
    role: 'enduser',
    isVerified: true,
    createdAt: '2023-04-15T00:00:00.000Z',
    updatedAt: '2023-04-15T00:00:00.000Z',
    lastLogin: '2023-04-18T11:20:00.000Z',
    status: 'suspended'
  }
];

interface UserFormData {
  username: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    role: 'enduser',
    status: 'active'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Simulate fetching users from API
    const fetchUsers = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setOpenEditDialog(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleAddUser = () => {
    setFormData({
      username: '',
      email: '',
      role: 'enduser',
      status: 'active'
    });
    setOpenAddDialog(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value
    });
  };

  const handleSaveEdit = () => {
    if (selectedUser) {
      // In a real app, this would be an API call
      const updatedUsers = users.map(user => 
        user._id === selectedUser._id ? { ...user, ...formData } : user
      );
      setUsers(updatedUsers);
      setOpenEditDialog(false);
      showNotification('User updated successfully', 'success');
    }
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      // In a real app, this would be an API call
      const updatedUsers = users.filter(user => user._id !== selectedUser._id);
      setUsers(updatedUsers);
      setOpenDeleteDialog(false);
      showNotification('User deleted successfully', 'success');
    }
  };

  const handleAddNewUser = () => {
    // In a real app, this would be an API call
    const newUser: User = {
      _id: `${users.length + 1}`,
      username: formData.username,
      email: formData.email,
      role: formData.role,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: formData.status
    };
    
    setUsers([...users, newUser]);
    setOpenAddDialog(false);
    showNotification('User added successfully', 'success');
  };

  const handleCloseDialogs = () => {
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setOpenAddDialog(false);
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refreshing users from API
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
      showNotification('Users refreshed', 'info');
    }, 1000);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Manage user accounts, roles, and permissions.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              size="small"
              label="Search Users"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon color="action" />
              }}
            />
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
          >
            Add User
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow key={user._id}>
                        <TableCell component="th" scope="row">
                          {user.username}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            color={
                              user.role === 'admin' ? 'primary' : 
                              user.role === 'supervisor' ? 'secondary' : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.status} 
                            color={
                              user.status === 'active' ? 'success' :
                              user.status === 'suspended' ? 'warning' : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleEdit(user)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(user)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                  <MenuItem value="enduser">End User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user "{selectedUser?.username}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                  <MenuItem value="enduser">End User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button 
            onClick={handleAddNewUser} 
            variant="contained"
            disabled={!formData.username || !formData.email}
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserManagement;