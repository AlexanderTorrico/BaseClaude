import React from 'react';
import { Button } from 'reactstrap';
import AzHeaderCardViews from '@/components/aziende/AzHeader/AzHeaderCardViews';
import { usePaymentmethods } from '../hooks/usePaymentmethods';

interface HeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ loading, onRefresh }) => {
  const { getEnabledMethodsCount, getTotalMethods, getActiveAccountsCount, getTotalAccounts } = usePaymentmethods();

  return (
    <AzHeaderCardViews
      title="Métodos de Pago"
      description="Configura las cuentas de pago que estarán disponibles en tus páginas"
      badge={{
        count: getActiveAccountsCount(),
        total: getTotalAccounts(),
        color: 'success',
        text: `${getEnabledMethodsCount()}/${getTotalMethods()} métodos habilitados`
      }}
      hideViewButtons={true}
      contentTopRight={
        <Button
          color="light"
          onClick={onRefresh}
          disabled={loading}
          className="d-flex align-items-center"
        >
          <i className={`mdi mdi-refresh ${loading ? 'mdi-spin' : ''} me-1`} />
          Actualizar
        </Button>
      }
    />
  );
};

export default Header;
