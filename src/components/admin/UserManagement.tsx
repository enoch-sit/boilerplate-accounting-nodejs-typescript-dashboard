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
  Alert,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  Checkbox
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
  Group as GroupIcon,
  RotateLeft as ResetIcon,
  Report as ReportIcon,
  FileDownload as DownloadIcon,
  DeleteSweep as DeleteSweepIcon
} from '@mui/icons-material';
import { User, UserRole, UserFormData, BatchUserData } from '../../types/auth';
import adminService from '../../services/adminService';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openBatchDialog, setOpenBatchDialog] = useState(false);
  const [openReportsDialog, setOpenReportsDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectAllUsers, setSelectAllUsers] = useState(false);
  const [formData, setFormData] = useState<UserFormData & { password?: string; skipVerification?: boolean }>({
    username: '',
    email: '',
    role: 'enduser',
    status: 'active'
  });
  const [batchUsers, setBatchUsers] = useState<BatchUserData[]>([]);
  const [batchUserString, setBatchUserString] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportType, setReportType] = useState('users');
  const [reportFormat, setReportFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf');
  const [reportDateRange, setReportDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null
  });
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>( {
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Fetch users from API
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (error: any) {
        showNotification(error.message || 'Error fetching users', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = Array.isArray(users) 
    ? users.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleChangePage = (_event: unknown, newPage: number) => {
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

  const handleBatchUserUpdate = () => {
    setOpenBatchDialog(true);
    setBatchUserString('');
    setBatchUsers([]);
    setFormData(prev => ({
      ...prev,
      skipVerification: true
    }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value
    });
  };

  const handleBatchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBatchUserString(e.target.value);
    try {
      // Parse the textarea content as CSV or JSON
      const lines = e.target.value.trim().split('\n');
      const parsedUsers: BatchUserData[] = [];
      
      lines.forEach(line => {
        if (line.trim()) {
          // Assume CSV format: username,email,role
          const parts = line.split(',').map(part => part.trim());
          if (parts.length >= 2) {
            parsedUsers.push({
              username: parts[0],
              email: parts[1],
              role: (parts[2] as UserRole) || 'enduser'
            });
          }
        }
      });
      
      setBatchUsers(parsedUsers);
    } catch (error) {
      console.error('Error parsing batch user data:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (selectedUser) {
      setLoading(true);
      try {
        await adminService.updateUser(selectedUser._id, formData);
        // Refresh the user list
        const updatedUsers = await adminService.getAllUsers();
        setUsers(updatedUsers);
        setOpenEditDialog(false);
        showNotification('User updated successfully', 'success');
      } catch (error: any) {
        showNotification(error.message || 'Error updating user', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      setLoading(true);
      try {
        await adminService.deleteUser(selectedUser._id);
        // Refresh the user list
        const updatedUsers = await adminService.getAllUsers();
        setUsers(updatedUsers);
        setOpenDeleteDialog(false);
        showNotification('User deleted successfully', 'success');
      } catch (error: any) {
        showNotification(error.message || 'Error deleting user', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddNewUser = async () => {
    setLoading(true);
    try {
      // Generate a random password for the new user (if not provided)
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-4);
      
      // Create the user data object with all required fields
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password || randomPassword,
        role: formData.role,
        status: formData.status, // Include status as it's required in UserFormData
        skipVerification: formData.skipVerification || false
      };
      
      await adminService.createUser(userData);
      // Refresh the user list
      const updatedUsers = await adminService.getAllUsers();
      setUsers(updatedUsers);
      setOpenAddDialog(false);
      showNotification('User added successfully', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Error adding user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatchUsers = async () => {
    if (batchUsers.length === 0) {
      showNotification('No valid users to add', 'error');
      return;
    }

    setLoading(true);
    try {
      await adminService.addBatchUsers(batchUsers, formData.skipVerification ?? false);
      // Refresh the user list
      const updatedUsers = await adminService.getAllUsers();
      setUsers(updatedUsers);
      setOpenBatchDialog(false);
      showNotification(`${batchUsers.length} users added successfully`, 'success');
    } catch (error: any) {
      showNotification(error.message || 'Error adding batch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  // New handlers for bulk delete functionality
  const handleToggleSelectUser = (userId: string) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleToggleSelectAll = () => {
    const newSelectAll = !selectAllUsers;
    setSelectAllUsers(newSelectAll);
    
    if (newSelectAll) {
      // Select all filtered users
      setSelectedUserIds(filteredUsers.map(user => user._id));
    } else {
      // Deselect all
      setSelectedUserIds([]);
    }
  };

  const handleOpenBulkDeleteDialog = () => {
    if (selectedUserIds.length === 0) {
      showNotification('No users selected for deletion', 'warning');
      return;
    }
    setOpenBulkDeleteDialog(true);
  };

  const handleBulkDelete = async () => {
    if (selectedUserIds.length === 0) return;
    
    setLoading(true);
    try {
      await adminService.deleteUsers(selectedUserIds);
      // Refresh the user list
      const updatedUsers = await adminService.getAllUsers();
      setUsers(updatedUsers);
      setSelectedUserIds([]);
      setSelectAllUsers(false);
      setOpenBulkDeleteDialog(false);
      showNotification(`${selectedUserIds.length} users deleted successfully`, 'success');
    } catch (error: any) {
      showNotification(error.message || 'Error deleting users', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Reports functionality
  const handleOpenReportsDialog = () => {
    setOpenReportsDialog(true);
    setReportType('users');
    setReportFormat('pdf');
    setReportDateRange({
      startDate: null,
      endDate: null
    });
  };

  const handleCloseReportsDialog = () => {
    setOpenReportsDialog(false);
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const startDate = reportDateRange.startDate;
      const endDate = reportDateRange.endDate;
      
      const blob = await adminService.downloadReport(
        reportType,
        reportFormat,
        startDate || undefined,
        endDate || undefined
      );
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${reportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showNotification('Report generated successfully', 'success');
      setOpenReportsDialog(false);
    } catch (error: any) {
      showNotification(error.message || 'Error generating report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialogs = () => {
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setOpenAddDialog(false);
    setOpenBatchDialog(false);
    setOpenBulkDeleteDialog(false);
    setOpenReportsDialog(false);
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

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
      showNotification('Users refreshed', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Error refreshing users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      await adminService.resetUserPassword(userId);
      showNotification('Password reset email sent to user', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Error resetting password', 'error');
    }
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Generate user reports">
              <Button
                variant="outlined"
                color="info"
                startIcon={<ReportIcon />}
                onClick={handleOpenReportsDialog}
              >
                Reports
              </Button>
            </Tooltip>
            <Tooltip title="Add multiple users at once">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<GroupIcon />}
                onClick={handleBatchUserUpdate}
              >
                Batch Add
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
            >
              Add User
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {selectedUserIds.length > 0 && (
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2">
                  {selectedUserIds.length} users selected
                </Typography>
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<DeleteSweepIcon />}
                  onClick={handleOpenBulkDeleteDialog}
                >
                  Delete Selected
                </Button>
              </Box>
            )}
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedUserIds.length > 0 && selectedUserIds.length < filteredUsers.length}
                        checked={selectAllUsers}
                        onChange={handleToggleSelectAll}
                      />
                    </TableCell>
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
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedUserIds.includes(user._id)}
                            onChange={() => handleToggleSelectUser(user._id)}
                          />
                        </TableCell>
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
                          <Tooltip title="Edit User">
                            <IconButton size="small" onClick={() => handleEdit(user)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton size="small" onClick={() => handleDelete(user)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reset Password">
                            <IconButton size="small" onClick={() => handleResetPassword(user._id)}>
                              <ResetIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
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
            <Grid component="div" sx={{ gridColumn: "span 12" }}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid component="div" sx={{ gridColumn: "span 12" }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid component="div" sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      role: event.target.value as UserRole
                    });
                  }}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                  <MenuItem value="enduser">End User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid component="div" sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      status: event.target.value as 'active' | 'inactive' | 'suspended'
                    });
                  }}
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
            <Grid component="div" sx={{ gridColumn: "span 12" }}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid component="div" sx={{ gridColumn: "span 12" }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid component="div" sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      role: event.target.value as UserRole
                    });
                  }}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                  <MenuItem value="enduser">End User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid component="div" sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      status: event.target.value as 'active' | 'inactive' | 'suspended'
                    });
                  }}
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

      {/* Batch Update Users Dialog */}
      <Dialog 
        open={openBatchDialog} 
        onClose={handleCloseDialogs}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Batch Update Users</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Enter multiple users in CSV format (one per line): username, email, role(optional)
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Example: 
              <br />
              john_doe, john@example.com, enduser
              <br />
              jane_smith, jane@example.com, supervisor
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            placeholder="username, email, role"
            value={batchUserString}
            onChange={handleBatchTextChange}
            sx={{ mb: 3 }}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={formData.skipVerification}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  skipVerification: e.target.checked
                }))}
              />
            }
            label="Skip email verification"
          />
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Users to add: {batchUsers.length}
          </Typography>
          
          {batchUsers.length > 0 && (
            <TableContainer sx={{ maxHeight: 200 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {batchUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role || 'enduser'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Note: Passwords will be auto-generated and emailed directly to users.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button 
            onClick={handleAddBatchUsers} 
            variant="contained"
            disabled={batchUsers.length === 0 || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
          >
            Upload {batchUsers.length} Users
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

      {/* Bulk Delete Dialog */}
      <Dialog open={openBulkDeleteDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Bulk Delete Users</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedUserIds.length} selected users? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleBulkDelete} color="error" variant="contained">Delete All Selected</Button>
        </DialogActions>
      </Dialog>

      {/* Reports Dialog */}
      <Dialog
        open={openReportsDialog}
        onClose={handleCloseReportsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Generate Reports</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: '1fr', mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="users">User List</MenuItem>
                <MenuItem value="user-activity">User Activity</MenuItem>
                <MenuItem value="login-history">Login History</MenuItem>
                <MenuItem value="user-roles">User Roles Summary</MenuItem>
                <MenuItem value="status-summary">User Status Summary</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Format</InputLabel>
              <Select
                value={reportFormat}
                label="Format"
                onChange={(e) => setReportFormat(e.target.value as 'pdf' | 'csv' | 'excel')}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={reportDateRange.startDate || ''}
                onChange={(e) => setReportDateRange({
                  ...reportDateRange,
                  startDate: e.target.value
                })}
              />

              <TextField
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={reportDateRange.endDate || ''}
                onChange={(e) => setReportDateRange({
                  ...reportDateRange,
                  endDate: e.target.value
                })}
              />
            </Box>

            <Typography variant="body2" color="text.secondary">
              Note: Date range is optional. If not specified, all data will be included in the report.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReportsDialog}>Cancel</Button>
          <Button
            onClick={handleGenerateReport}
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
            disabled={loading}
          >
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;