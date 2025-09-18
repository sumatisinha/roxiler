import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../api/api';

const AddStoreForm = ({ onStoreAdded }) => {
  const formik = useFormik({
    initialValues: { name: '', email: '', address: '', owner_id: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      address: Yup.string().required('Required'),
      // Assuming owner_id is the User ID of the store owner
      owner_id: Yup.number().required('Owner User ID is required'),
    }),
    onSubmit: async (values, { resetForm, setSubmitting, setStatus }) => {
      setStatus(null);
      try {
        await API.post('/stores', values);
        setStatus('Store added successfully!');
        resetForm();
        if (onStoreAdded) onStoreAdded(); // Refresh the store list
      } catch (err) {
        setStatus(err.response?.data?.error || 'Failed to add store.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div style={{ border: '1px solid blue', padding: '15px', margin: '20px 0' }}>
      <h3>Add a New Store (Admin)</h3>
      <form onSubmit={formik.handleSubmit}>
        <input name="name" placeholder="Store Name" {...formik.getFieldProps('name')} />
        {formik.touched.name && formik.errors.name && <div>{formik.errors.name}</div>}
        
        <input name="email" placeholder="Store Email" {...formik.getFieldProps('email')} />
        {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}

        <input name="address" placeholder="Store Address" {...formik.getFieldProps('address')} />
        {formik.touched.address && formik.errors.address && <div>{formik.errors.address}</div>}

        <input name="owner_id" type="number" placeholder="Owner's User ID" {...formik.getFieldProps('owner_id')} />
        {formik.touched.owner_id && formik.errors.owner_id && <div>{formik.errors.owner_id}</div>}

        <button type="submit" disabled={formik.isSubmitting}>Add Store</button>
        {formik.status && <p>{formik.status}</p>}
      </form>
    </div>
  );
};

export default AddStoreForm;