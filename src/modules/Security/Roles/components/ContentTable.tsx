import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Alert } from 'reactstrap';
import AzFilterSummary from '../../../../components/aziende/AzFilterSummary';
import AzTable from '../../../../components/aziende/AzTable';
import { roleTableColumns } from '../config/tableColumns';
import { MOCK_ROLES } from '../data/mockRoles';
import { RoleModel } from '../models/RoleModel';
import RoleFormModal from './RoleFormModal';
import RolePermissionsModal from './RolePermissionsModal';
import { toast } from 'react-toastify';

/**
 * Tabla de contenido del módulo Roles
 * Muestra todos los roles con filtros, ordenamiento y acciones
 */
const ContentTable: React.FC = () => {
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleModel | null>(null);

  /**
   * Cargar roles al montar el componente
   */
  useEffect(() => {
    loadRoles();
  }, []);

  /**
   * Simula carga de roles desde API
   */
  const loadRoles = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Cargar datos mockeados
      setRoles(MOCK_ROLES);
    } catch (err) {
      setError('Error al cargar los roles. Por favor, intente nuevamente.');
      console.error('Error loading roles:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abre modal para ver/editar permisos de un rol
   */
  const handleViewPermissions = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setSelectedRole(role);
      setIsPermissionsModalOpen(true);
    }
  };

  /**
   * Abre modal para editar un rol
   */
  const handleEditRole = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setSelectedRole(role);
      setIsEditModalOpen(true);
    }
  };

  /**
   * Elimina un rol (con confirmación)
   */
  const handleDeleteRole = async (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    // Validación: No permitir eliminar si tiene usuarios asignados
    if (role.userCount > 0) {
      toast.warning(
        `⚠️ No se puede eliminar el rol "${role.name}". Tiene ${role.userCount} usuario(s) asignado(s). Debes reasignar o eliminar los usuarios antes de eliminar este rol.`,
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
      return;
    }

    // Confirmar eliminación
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el rol "${role.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmed) {
      try {
        // Simular eliminación en backend
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Remover del estado local
        setRoles(prev => prev.filter(r => r.id !== roleId));

        // Mostrar toast de éxito
        toast.success(`✅ Rol "${role.name}" eliminado exitosamente`, {
          position: 'top-right',
          autoClose: 3000,
        });
      } catch (error) {
        toast.error('❌ Error al eliminar el rol. Intente nuevamente.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  /**
   * Callback cuando se actualiza un rol
   */
  const handleRoleUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedRole(null);
    loadRoles(); // Recargar lista
  };

  /**
   * Callback cuando se actualizan permisos
   */
  const handlePermissionsUpdated = () => {
    setIsPermissionsModalOpen(false);
    setSelectedRole(null);
    loadRoles(); // Recargar lista
  };

  /**
   * Toggle estado activo/inactivo de un rol
   */
  const handleToggleStatus = async (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    try {
      // Simular actualización en backend
      await new Promise(resolve => setTimeout(resolve, 500));

      // Actualizar estado local
      setRoles(prev =>
        prev.map(r =>
          r.id === roleId ? { ...r, isActive: !r.isActive } : r
        )
      );

      toast.success(
        `✅ Rol "${role.name}" ${!role.isActive ? 'activado' : 'desactivado'} exitosamente`,
        {
          position: 'top-right',
          autoClose: 2000,
        }
      );
    } catch (error) {
      toast.error('❌ Error al actualizar el estado. Intente nuevamente.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      {/* Mensaje de error */}
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert color="danger" className="d-flex align-items-center">
              <i className="mdi mdi-alert-circle-outline me-2 font-size-18"></i>
              <div>
                <strong>Error:</strong> {error}
                <Button
                  color="link"
                  size="sm"
                  onClick={loadRoles}
                  className="text-danger ms-2"
                >
                  <i className="mdi mdi-refresh"></i> Reintentar
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Tabla de roles */}
      <Row>
        <Col xl={12}>
          <AzFilterSummary
            data={roles}
            columns={roleTableColumns}
            alwaysVisible={true}
            showCount="always"
            countPosition="top"
          >
            {({ filteredData, onFilterChange, onSortChange, filters, sorting }) => (
              <AzTable
                data={filteredData}
                columns={roleTableColumns}
                pagination={true}
                filters={filters}
                onFilterChange={onFilterChange}
                sorting={sorting}
                onSortChange={onSortChange}
                className="table-centered table-nowrap"
                loading={loading}
              >
                <AzTable.Actions>
                  {/* Botón Ver Permisos */}
                  <Button
                    size="sm"
                    color="info"
                    outline
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      const rowData = JSON.parse(
                        e.currentTarget.getAttribute('data-row') || '{}'
                      ) as RoleModel;
                      handleViewPermissions(rowData.id);
                    }}
                    title="Ver y gestionar permisos"
                  >
                    <i className="mdi mdi-key-variant"></i>
                  </Button>

                  {/* Botón Editar */}
                  <Button
                    size="sm"
                    color="primary"
                    outline
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      const rowData = JSON.parse(
                        e.currentTarget.getAttribute('data-row') || '{}'
                      ) as RoleModel;
                      handleEditRole(rowData.id);
                    }}
                    title="Editar rol"
                  >
                    <i className="mdi mdi-pencil"></i>
                  </Button>

                  {/* Botón Toggle Estado */}
                  <Button
                    size="sm"
                    color="warning"
                    outline
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      const rowData = JSON.parse(
                        e.currentTarget.getAttribute('data-row') || '{}'
                      ) as RoleModel;
                      handleToggleStatus(rowData.id);
                    }}
                    title={(e: React.MouseEvent<HTMLButtonElement>) => {
                      const rowData = JSON.parse(
                        e.currentTarget.getAttribute('data-row') || '{}'
                      ) as RoleModel;
                      return rowData.isActive ? 'Desactivar rol' : 'Activar rol';
                    }}
                  >
                    <i className="mdi mdi-power"></i>
                  </Button>

                  {/* Botón Eliminar */}
                  <Button
                    size="sm"
                    color="danger"
                    outline
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      const rowData = JSON.parse(
                        e.currentTarget.getAttribute('data-row') || '{}'
                      ) as RoleModel;
                      handleDeleteRole(rowData.id);
                    }}
                    title="Eliminar rol"
                  >
                    <i className="mdi mdi-trash-can"></i>
                  </Button>
                </AzTable.Actions>
              </AzTable>
            )}
          </AzFilterSummary>

          {/* Empty State */}
          {!loading && roles.length === 0 && (
            <div className="text-center py-5">
              <div className="avatar-lg mx-auto mb-4">
                <div className="avatar-title bg-soft-primary text-primary rounded-circle">
                  <i className="mdi mdi-shield-account display-4"></i>
                </div>
              </div>
              <h5 className="mt-3">No hay roles disponibles</h5>
              <p className="text-muted">
                Crea tu primer rol para comenzar a gestionar permisos
              </p>
            </div>
          )}
        </Col>
      </Row>

      {/* Modal para editar rol */}
      {selectedRole && (
        <RoleFormModal
          isOpen={isEditModalOpen}
          toggle={() => setIsEditModalOpen(false)}
          onSuccess={handleRoleUpdated}
          mode="edit"
          roleData={selectedRole}
        />
      )}

      {/* Modal para gestionar permisos */}
      {selectedRole && (
        <RolePermissionsModal
          isOpen={isPermissionsModalOpen}
          toggle={() => setIsPermissionsModalOpen(false)}
          role={selectedRole}
          onSuccess={handlePermissionsUpdated}
        />
      )}
    </>
  );
};

export default ContentTable;
