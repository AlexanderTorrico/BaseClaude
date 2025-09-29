import React from 'react';

import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
} from 'reactstrap';
import { LoginForm } from './components/LoginForm';
import { ContainerWrapper } from './components/ContainerWrapper';

// Import images - same as original
import profile from '../../assets/images/profile-img.png';
import logo from '../../assets/images/logo.svg';
import lightlogo from '../../assets/images/logo-light.svg';

const LoginPage = () => {
  // Meta title - same as original
  document.title = 'Login | Skote - Vite React Admin & Dashboard Template';


  return (
    <ContainerWrapper>
      <LoginForm />
    </ContainerWrapper>
  );
};

export default LoginPage;