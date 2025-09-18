import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../api/api';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert } from '@mui/material';

const UpdatePasswordForm = ({ open, onClose }) => {
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .matches(/[A-Z]/, 'Must contain an uppercase letter')
        .matches(/[!@#$%^&*]/, 'Must contain a special character')
        .required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Required')
    }),
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
      setStatus(null);
      try {
        await API.post('/users/update-password', {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword
        });
        setStatus({ severity: 'success', message: 'Password updated successfully!' });
        setTimeout(() => {
          resetForm();
          onClose();
        }, 2000);
      } catch (err) {
        setStatus({ severity: 'error', message: err.response?.data?.error || 'Failed to update password.' });
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Your Password</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          {formik.status && <Alert severity={formik.status.severity} sx={{ mb: 2 }}>{formik.status.message}</Alert>}
          <TextField
            name="oldPassword"
            label="Current Password"
            type="password"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('oldPassword')}
            error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
            helperText={formik.touched.oldPassword && formik.errors.oldPassword}
          />
          <TextField
            name="newPassword"
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('newPassword')}
            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
          />
          <TextField
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('confirmPassword')}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={formik.isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting}>Update Password</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdatePasswordForm;