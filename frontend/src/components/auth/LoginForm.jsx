import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LoginForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required')
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const { data } = await API.post('/auth/login', values);
        localStorage.setItem('token', data.token);
        
        // MODIFICATION: Decode token to get user role and redirect accordingly
        const { role } = jwtDecode(data.token);

        switch (role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'owner':
            navigate('/owner');
            break;
          default:
            navigate('/user');
            break;
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
        setFieldError('email', errorMessage); // Show error message near the form
        setSubmitting(false);
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Login</h2>
      <input 
        name="email" 
        type="email"
        placeholder="Email" 
        value={formik.values.email} 
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
      
      <input 
        type="password" 
        name="password" 
        placeholder="Password" 
        value={formik.values.password} 
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}

      <button type="submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;