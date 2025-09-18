import React, { useState, useEffect, useCallback } from 'react';
import API from '../../api/api';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Select, MenuItem, Button, Alert,
  Grid, TextField, FormControl, InputLabel
} from '@mui/material';
import { debounce } from 'lodash';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });

  // ✅ Step 1: Simple fetch for initial load
  const fetchUsersInitial = async () => {
    setLoading(true);
    try {
      // This line, from Step 1, receives the data
      const response = await API.get('/users');

      // This line saves the delivered "pizza" to the component's "table" (its state)
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Debounced fetch for filtering
  const fetchUsersFiltered = useCallback(
    debounce(async (currentFilters) => {
      setLoading(true);
      const activeFilters = Object.fromEntries(
        Object.entries(currentFilters).filter(([_, v]) => v !== '')
      );
      try {
        const response = await API.get('/users', { params: activeFilters });
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  // ✅ On mount, fetch all users initially
  useEffect(() => {
    fetchUsersInitial();
  }, []);

  // ✅ Whenever filters change, fetch filtered users
  useEffect(() => {
    fetchUsersFiltered(filters);
  }, [filters, fetchUsersFiltered]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map((user) =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleUpdateRole = async (userId, newRole) => {
    setError(null);
    setSuccess(null);
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      setSuccess(`Successfully updated role for user ID ${userId}.`);
    } catch (err) {
      setError(`Failed to update role for user ID ${userId}.`);
      fetchUsersFiltered(filters); // re-fetch with filters on failure
    }
  };

  if (loading) return <Typography>Loading users...</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>User Management</Typography>
      
      {/* ✅ Filter Inputs */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={3}>
          <TextField label="Filter by Name" name="name" fullWidth onChange={handleFilterChange} size="small" />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField label="Filter by Email" name="email" fullWidth onChange={handleFilterChange} size="small" />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField label="Filter by Address" name="address" fullWidth onChange={handleFilterChange} size="small" />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Filter by Role</InputLabel>
            <Select name="role" label="Filter by Role" value={filters.role} onChange={handleFilterChange}>
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="owner">Owner</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          {/* ✅ Step 3: This part of the JSX then puts each "slice" on a plate for you to see */}
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="owner">Owner</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => handleUpdateRole(user.id, user.role)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagement;
