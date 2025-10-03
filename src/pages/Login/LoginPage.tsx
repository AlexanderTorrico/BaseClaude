
import { LoginForm } from './components/LoginForm';
import { ContainerWrapper } from './components/ContainerWrapper';


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