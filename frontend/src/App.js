import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, CssBaseline, Button } from '@mui/material';

import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';
import AdminDashboard from './components/dashboard/AdminDashboard';
import UserDashboard from './components/dashboard/UserDashboard';
import OwnerDashboard from './components/dashboard/OwnerDashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const token = localStorage.getItem('token');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Force reload to clear state
  };

  return (
    <BrowserRouter>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/user" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Store Rater
          </Typography>
          {!token ? (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/user" element={<ProtectedRoute roles={['normal', 'owner', 'admin']}><UserDashboard /></ProtectedRoute>} />
          <Route path="/owner" element={<ProtectedRoute roles={['owner']}><OwnerDashboard /></ProtectedRoute>} />

          <Route path="/" element={<SignupForm />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;