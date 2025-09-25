import React from 'react';
import { Alert } from 'reactstrap';

interface RegisterAlertProps {
  error?: string | undefined;
  success?: string | undefined;
}

const RegisterAlert: React.FC<RegisterAlertProps> = ({ error, success }) => {
  if (!error && !success) return null;

  return (
    <>
      {success && (
        <Alert color="success" fade={true} timeout={150}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert color="danger" fade={true} timeout={150}>
          {error}
        </Alert>
      )}
    </>
  );
};

export default RegisterAlert;