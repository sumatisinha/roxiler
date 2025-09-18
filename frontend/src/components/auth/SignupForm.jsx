import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../api/api';
// MODIFICATION: Import Link from react-router-dom
import { useNavigate, Link } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: '', email: '', address: '', password: '' },
    validationSchema: Yup.object({
      name: Yup.string().min(3, 'Must be at least 3 characters').max(60).required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      address: Yup.string().max(400).required('Required'),
      password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
        .matches(/[!@#$%^&*]/, 'Must contain at least one special character')
        .required('Required'),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const { data } = await API.post('/auth/signup', values);
        localStorage.setItem('token', data.token);
        navigate('/user');
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Signup failed. Please try again.';
        setFieldError('email', errorMessage); 
        setSubmitting(false);
      }
    }
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <h2>Sign Up</h2>
        <input name="name" placeholder="Name" {...formik.getFieldProps('name')}/>
        {formik.touched.name && formik.errors.name ? <div>{formik.errors.name}</div> : null}
        
        <input name="email" placeholder="Email" {...formik.getFieldProps('email')}/>
        {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
        
        <input name="address" placeholder="Address" {...formik.getFieldProps('address')}/>
        {formik.touched.address && formik.errors.address ? <div>{formik.errors.address}</div> : null}
        
        <input type="password" name="password" placeholder="Password" {...formik.getFieldProps('password')}/>
        {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}
        
        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      {/* MODIFICATION: Add a link to the login page */}
      <p style={{ marginTop: '15px' }}>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
};

export default SignupForm;