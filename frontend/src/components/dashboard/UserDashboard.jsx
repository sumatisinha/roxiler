import React, { useState, useEffect } from 'react';
import StoreList from '../StoreList';
import AddStoreForm from '../AddStoreForm';
import UpdatePasswordForm from '../profile/UpdatePasswordForm';
import { jwtDecode } from 'jwt-decode';
import { Box, Typography, Button } from '@mui/material';

const UserDashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const [storeListVersion, setStoreListVersion] = useState(0);
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    }
  }, []);

  const handleStoreAdded = () => {
    setStoreListVersion(prevVersion => prevVersion + 1);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>User Dashboard</Typography>
        <Button variant="outlined" onClick={() => setPasswordFormOpen(true)}>Change Password</Button>
      </Box>
      
      <Typography>Welcome! Here are the stores you can rate.</Typography>
      
      {userRole === 'admin' && <AddStoreForm onStoreAdded={handleStoreAdded} />}
      
      <hr style={{ margin: '20px 0' }} />
      
      <StoreList key={storeListVersion} canRate={userRole === 'normal'} />

      <UpdatePasswordForm 
        open={passwordFormOpen}
        onClose={() => setPasswordFormOpen(false)}
      />
    </Box>
  );
};

export default UserDashboard;