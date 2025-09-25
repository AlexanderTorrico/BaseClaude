import React, { useEffect } from 'react';
import { Form, Input, Label, FormFeedback, Button } from 'reactstrap';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { registerValidationSchema } from '../utils/registerValidators';
import { RegisterCredentials } from '../types/registerTypes';
import { useRegisterAuth } from '../hooks/useRegisterAuth';
import RegisterAlert from './RegisterAlert';

interface RegisterFormProps {}

const RegisterForm: React.FC<RegisterFormProps> = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, isRegistered, clearError } = useRegisterAuth();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values: RegisterCredentials) => {
      console.log('🎯 RegisterForm - Submitting form with values:', values);
      const result = await register(values);

      if (result.success) {
        console.log('✅ RegisterForm - Registration successful, redirecting to login');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    }
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  return (
    <Form
      className="form-horizontal"
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}
    >
      <RegisterAlert
        error={error}
        success={isRegistered ? "Registration successful! Redirecting to login..." : undefined}
      />

      <div className="mb-3">
        <Label className="form-label">Email</Label>
        <Input
          id="email"
          name="email"
          className="form-control"
          placeholder="Enter email"
          type="email"
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values.email || ""}
          invalid={
            validation.touched.email && validation.errors.email ? true : false
          }
        />
        {validation.touched.email && validation.errors.email ? (
          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
        ) : null}
      </div>

      <div className="mb-3">
        <Label className="form-label">Username</Label>
        <Input
          name="username"
          type="text"
          placeholder="Enter username"
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values.username || ""}
          invalid={
            validation.touched.username && validation.errors.username ? true : false
          }
        />
        {validation.touched.username && validation.errors.username ? (
          <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
        ) : null}
      </div>

      <div className="mb-3">
        <Label className="form-label">Password</Label>
        <Input
          name="password"
          type="password"
          placeholder="Enter Password"
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values.password || ""}
          invalid={
            validation.touched.password && validation.errors.password ? true : false
          }
        />
        {validation.touched.password && validation.errors.password ? (
          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
        ) : null}
      </div>

      <div className="mt-4">
        <Button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="mb-0">
          By registering you agree to the Skote{" "}
          <Link to="#" className="text-primary">
            Terms of Use
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default RegisterForm;