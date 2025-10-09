import React from 'react';
import { Button } from 'reactstrap';
import { AzHeaderCard } from '../../../../components/aziende/AzHeader';
import { useUsers } from '../hooks/useUsers';

const Header: React.FC = () => {
  const { loading, fetchUsersByCompany, getTotalUsers } = useUsers();

  const handleCreateUser = () => {
    console.log('Crear nuevo usuario');
  };

  const handleRefresh = async () => {
    const response = await fetchUsersByCompany(1, { force: true });
    if (response.success) {
      console.log('🔄 Datos actualizados desde la API');
    }
  };

  return (
    <AzHeaderCard
      title="Gestión de Usuarios"
      description="Administra los usuarios del sistema"
      showBadge={true}
      badgeColor="primary"
      badgeCount={getTotalUsers()}
      badgeTotal={getTotalUsers()}
      contentTopRight={
        <div className="d-flex gap-2">
          <Button
            color="light"
            onClick={handleRefresh}
            className="d-flex align-items-center"
            disabled={loading}
            title="Actualizar datos"
          >
            <i className={`mdi mdi-refresh ${loading ? 'mdi-spin' : ''} me-1`}></i>
            Actualizar
          </Button>
          <Button
            color="warning"
            onClick={handleCreateUser}
            className="d-flex align-items-center"
            disabled={loading}
          >
            <i className="mdi mdi-plus me-1"></i>
            Nuevo Usuario
          </Button>
        </div>
      }
    />
  );
};

export default Header;
