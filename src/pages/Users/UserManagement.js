import React, { useState, useEffect } from 'react';
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
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Search,
  MoreVert,
  PersonOff,
  Person,
  Edit
} from '@mui/icons-material';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import userService from '../../services/userService';
import { formatDate, debounce } from '../../utils/helpers';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    user: null,
    action: null
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.size]);

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      if (searchQuery) {
        searchUsers();
      } else {
        fetchUsers();
      }
    }, 500);

    debouncedSearch();
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await userService.getUsersPaginated(pagination.page, pagination.size);

      setUsers(response.content || response);
      setPagination(prev => ({
        ...prev,
        totalElements: response.totalElements || response.length
      }));
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const results = await userService.searchUsers(searchQuery);
      setUsers(results);
      setPagination(prev => ({
        ...prev,
        totalElements: results.length
      }));
    } catch (error) {
      setError('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleUserAction = (action) => {
    setConfirmDialog({
      open: true,
      user: selectedUser,
      action
    });
    handleMenuClose();
  };

  const confirmAction = async () => {
    const { user, action } = confirmDialog;

    try {
      if (action === 'activate') {
        await userService.activateUser(user.id);
      } else if (action === 'deactivate') {
        await userService.deactivateUser(user.id);
      }

      fetchUsers();
    } catch (error) {
      setError(`Failed to ${action} user`);
    } finally {
      setConfirmDialog({ open: false, user: null, action: null });
    }
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (event) => {
    setPagination(prev => ({
      ...prev,
      size: parseInt(event.target.value, 10),
      page: 0
    }));
  };

  const getUserStatus = (user) => {
    return user.isActive !== false ? 'Active' : 'Inactive';
  };

  const getUserStatusColor = (user) => {
    return user.isActive !== false ? 'success' : 'error';
  };

  const getUserDisplayName = (user) => {
    if (!user) return '';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  const getUserInitials = (user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    return user.username?.[0]?.toUpperCase() || 'U';
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Manage user accounts and permissions
      </Typography>

      <Paper>
        {/* Search */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search users by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <ErrorMessage message={error} />

        {/* Users Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <LoadingSpinner message="Loading users..." />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2 }}>
                          {getUserInitials(user)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            {getUserDisplayName(user)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.roles ? (
                        user.roles.map((role, index) => (
                          <Chip
                            key={index}
                            label={role}
                            size="small"
                            sx={{ mr: 0.5 }}
                          />
                        ))
                      ) : (
                        <Chip label="USER" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getUserStatus(user)}
                        color={getUserStatusColor(user)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Actions">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, user)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={pagination.totalElements}
          page={pagination.page}
          onPageChange={handlePageChange}
          rowsPerPage={pagination.size}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      </Paper>

      {/* User Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedUser?.isActive !== false ? (
          <MenuItem onClick={() => handleUserAction('deactivate')}>
            <PersonOff sx={{ mr: 1 }} />
            Deactivate User
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleUserAction('activate')}>
            <Person sx={{ mr: 1 }} />
            Activate User
          </MenuItem>
        )}
      </Menu>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, user: null, action: null })}
        onConfirm={confirmAction}
        title={`${confirmDialog.action === 'activate' ? 'Activate' : 'Deactivate'} User`}
        message={`Are you sure you want to ${confirmDialog.action} ${getUserDisplayName(confirmDialog.user)}?`}
        confirmText={confirmDialog.action === 'activate' ? 'Activate' : 'Deactivate'}
        severity="warning"
      />
    </Box>
  );
};

export default UserManagement;