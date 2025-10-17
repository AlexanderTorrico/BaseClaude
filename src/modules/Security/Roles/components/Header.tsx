import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { AzHeaderCard } from '../../../../components/aziende/AzHeader';
import { getRoleStats } from '../data/mockRoles';
import RoleFormModal from './RoleFormModal';

/**
 * Header del módulo Roles
 * Muestra título, descripción, badges estadísticos y botones de acción
 */
const Header: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Obtener estadísticas de roles
  const stats = getRoleStats();

  /**
   * Simula actualización de datos
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    console.log('🔄 Datos de roles actualizados');
  };

  /**
   * Abre modal para crear nuevo rol
   */
  const handleCreateRole = () => {
    setIsCreateModalOpen(true);
  };

  /**
   * Cierra modal de creación
   */
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  /**
   * Callback cuando se crea un rol exitosamente
   */
  const handleRoleCreated = (roleName: string) => {
    console.log(`✅ Rol "${roleName}" creado exitosamente`);
    setIsCreateModalOpen(false);
    // En producción, aquí recargarías la tabla
  };

  return (
    <>
      <AzHeaderCard
        title="Gestión de Roles"
        description="Administra los roles del sistema y asigna permisos"
        showBadge={true}
        badgeColor="primary"
        badgeCount={stats.active}
        badgeTotal={stats.total}
        contentTopRight={
          <div className="d-flex gap-2 flex-wrap">
            {/* Botón Actualizar */}
            <Button
              color="light"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="d-flex align-items-center gap-1"
              title="Actualizar listado de roles"
            >
              <i
                className={`mdi mdi-refresh ${isRefreshing ? 'mdi-spin' : ''} font-size-16`}
              ></i>
              <span className="d-none d-sm-inline">Actualizar</span>
            </Button>

            {/* Botón Nuevo Rol */}
            <Button
              color="warning"
              onClick={handleCreateRole}
              className="d-flex align-items-center gap-1"
              title="Crear nuevo rol"
            >
              <i className="mdi mdi-plus font-size-16"></i>
              <span>Nuevo Rol</span>
            </Button>
          </div>
        }
      />

      {/* Modal para crear rol */}
      <RoleFormModal
        isOpen={isCreateModalOpen}
        toggle={handleCloseModal}
        onSuccess={handleRoleCreated}
        mode="create"
      />
    </>
  );
};

export default Header;
