import React, { useState, useEffect, useCallback } from 'react';
import API from "../api/api";
import RatingForm from "./RatingForm";
import { 
  Box, Typography, Card, CardContent, CardActions, Button, 
  CircularProgress, Alert, Grid, TextField 
} from '@mui/material';
import { debounce } from 'lodash';

export default function StoreList({ canRate = false }) {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });

  // MODIFICATION: Debounced fetch function to handle filtering
  const fetchStores = useCallback(debounce(async (currentFilters) => {
    setLoading(true);
    const activeFilters = Object.fromEntries(
      Object.entries(currentFilters).filter(([_, v]) => v !== '')
    );
    try {
      const response = await API.get('/stores', { params: activeFilters });
      setStores(response.data);
    } catch (err) {
      setError("Failed to fetch stores.");
    } finally {
      setLoading(false);
    }
  }, 500), []);

  useEffect(() => {
    fetchStores(filters);
  }, [fetchStores, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingSuccess = () => {
    setSelectedStore(null);
    fetchStores(filters); // Re-fetch with current filters
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>Stores</Typography>

      {/* MODIFICATION: Filter fields added */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}><TextField label="Filter by Name" name="name" fullWidth onChange={handleFilterChange} size="small" /></Grid>
        <Grid item xs={12} sm={4}><TextField label="Filter by Email" name="email" fullWidth onChange={handleFilterChange} size="small" /></Grid>
        <Grid item xs={12} sm={4}><TextField label="Filter by Address" name="address" fullWidth onChange={handleFilterChange} size="small" /></Grid>
      </Grid>
      
      {stores.length === 0 && <Typography>No stores found with the current filters.</Typography>}

      <Grid container spacing={3}>
        {stores.map((store) => (
          <Grid item key={store.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">{store.name}</Typography>
                <Typography variant="body2" color="text.secondary">{store.email}</Typography>
                <Typography variant="body2" color="text.secondary">{store.address}</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Average Rating:</strong> {store.averageRating || 'N/A'}
                </Typography>
              </CardContent>
              <CardActions>
                {canRate && <Button size="small" onClick={() => setSelectedStore(store)}>Rate This Store</Button>}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedStore && (
        <RatingForm
          store={selectedStore}
          open={Boolean(selectedStore)}
          onClose={() => setSelectedStore(null)}
          onSuccess={handleRatingSuccess}
        />
      )}
    </Box>
  );
}