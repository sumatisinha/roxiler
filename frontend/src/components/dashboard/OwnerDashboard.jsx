import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import UpdatePasswordForm from '../profile/UpdatePasswordForm';
import { 
  Box, Typography, Button, Paper, CircularProgress, Alert, 
  List, ListItem, ListItemText, Divider 
} from '@mui/material';

const OwnerDashboard = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);

  useEffect(() => {
    const fetchOwnerStore = async () => {
      try {
        const response = await API.get('/stores/my-store');
        setStore(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load store data.');
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerStore();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  // Calculate ratings inside the return statement to ensure 'store' is not null
  const ratings = store?.Ratings || [];
  const avg = ratings.length
    ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(2)
    : 'N/A';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Owner Dashboard</Typography>
        <Button variant="outlined" onClick={() => setPasswordFormOpen(true)}>Change Password</Button>
      </Box>

      {!store ? (
        <Typography>No store assigned to this account.</Typography>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>{store.name}</Typography>
          <Typography variant="body1" color="text.secondary">{store.email}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{store.address}</Typography>
          
          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Store Statistics</Typography>
          <Typography><strong>Average Rating:</strong> {avg}</Typography>
          <Typography><strong>Total Ratings Received:</strong> {ratings.length}</Typography>
          
          <Typography variant="h6" sx={{ mt: 3 }}>Individual Ratings:</Typography>
          {ratings.length > 0 ? (
            <List dense>
              {ratings.map(r => (
                <ListItem key={r.id}>
                  <ListItemText primary={`Rating: ${r.rating}`} secondary={`User ID: ${r.user_id}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No ratings yet.</Typography>
          )}
        </Paper>
      )}

      <UpdatePasswordForm 
        open={passwordFormOpen}
        onClose={() => setPasswordFormOpen(false)}
      />
    </Box>
  );
};

export default OwnerDashboard;