import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../api/api';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';

const AddUserForm = ({ open, onClose, onUserAdded }) => {
  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', address: '', role: 'normal' },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
      address: Yup.string().required('Required'),
      role: Yup.string().oneOf(['normal', 'owner', 'admin']).required('Required')
    }),
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
      setStatus(null);
      try {
        await API.post('/users', values);
        setStatus({ severity: 'success', message: 'User added successfully!' });
        resetForm();
        onUserAdded(); // Refresh the user list
        setTimeout(onClose, 2000); // Close dialog after 2 seconds
      } catch (err) {
        setStatus({ severity: 'error', message: err.response?.data?.error || 'Failed to add user.' });
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New User</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          {formik.status && <Alert severity={formik.status.severity}>{formik.status.message}</Alert>}
          <TextField name="name" label="Name" fullWidth margin="normal" {...formik.getFieldProps('name')} error={formik.touched.name && Boolean(formik.errors.name)} helperText={formik.touched.name && formik.errors.name} />
          <TextField name="email" label="Email" fullWidth margin="normal" {...formik.getFieldProps('email')} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
          <TextField name="password" label="Password" type="password" fullWidth margin="normal" {...formik.getFieldProps('password')} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
          <TextField name="address" label="Address" fullWidth margin="normal" {...formik.getFieldProps('address')} error={formik.touched.address && Boolean(formik.errors.address)} helperText={formik.touched.address && formik.errors.address} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select name="role" label="Role" {...formik.getFieldProps('role')}>
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="owner">Owner</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting}>Add User</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUserForm;