import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { useDispatch } from 'react-redux';
import AzHeaderCardViews from '../../../../components/aziende/AzHeader/AzHeaderCardViews';
import { useUsers } from '../hooks/useUsers';
import { setCurrentView } from '../slices/userSlice';
import { IUserService } from '../services/IUserService';

interface HeaderProps {
  service: IUserService;
}

const Header: React.FC<HeaderProps> = ({ service }) => {
  const dispatch = useDispatch();
  const { loading, fetchUsersByCompany, getTotalUsers, currentView } = useUsers(service);

  // Estado local para detectar tamaño de pantalla
  const [responsiveView, setResponsiveView] = useState<string>('0');
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Detectar tamaño de pantalla y ajustar vista automáticamente
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768; // Breakpoint md (768px)
      const autoView = isMobile ? '1' : '0'; // '0' = tabla, '1' = cards

      setResponsiveView(autoView);

      // Solo actualizar Redux si no hay override manual
      if (!isManualOverride) {
        dispatch(setCurrentView(autoView));
      }
    };

    // Ejecutar al montar
    handleResize();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, isManualOverride]);

  const handleCreateUser = () => {
    console.log('Crear nuevo usuario');
  };

  const handleRefresh = async () => {
    await fetchUsersByCompany(1, { force: true });
    console.log('🔄 Datos actualizados desde la API');
  };

  const handleViewChange = (viewKey: string) => {
    dispatch(setCurrentView(viewKey));
    setIsManualOverride(true);

    // Resetear override después de 5 segundos de inactividad
    setTimeout(() => {
      setIsManualOverride(false);
    }, 5000);
  };

  return (
    <AzHeaderCardViews
      title="Gestión de Usuarios"
      description="Administra los usuarios del sistema"
      badge={{
        count: getTotalUsers(),
        total: getTotalUsers(),
        color: 'primary'
      }}
      currentView={currentView}
      onViewChange={handleViewChange}
      views={[
        { key: '0', name: 'Tabla', icon: 'mdi-table', title: 'Vista Tabla' },
        { key: '1', name: 'Cards', icon: 'mdi-card-multiple', title: 'Vista Cards' }
      ]}
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
      responsiveMode={!isManualOverride}
      responsiveView={responsiveView}
      isManualOverride={isManualOverride}
    />
  );
};

export default Header;
