import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import UserManagement from './UserManagement';
import AddUserForm from './AddUserForm';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [userListVersion, setUserListVersion] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('/users/stats');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleUserAdded = () => {
    // Force the UserManagement component to re-fetch users by changing its key
    setUserListVersion(prev => prev + 1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
        <Button variant="contained" onClick={() => setAddUserOpen(true)}>Add New User</Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{stats.users}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Stores</Typography>
            <Typography variant="h4">{stats.stores}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Ratings</Typography>
            <Typography variant="h4">{stats.ratings}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <UserManagement key={userListVersion} />

      <AddUserForm 
        open={addUserOpen} 
        onClose={() => setAddUserOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </Box>
  );
};

export default AdminDashboard;