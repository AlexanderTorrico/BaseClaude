import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Badge,
  Alert,
} from 'reactstrap';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { UserModel } from '../models/UserModel';

interface UserRolesPermissionsModalProps {
  isOpen: boolean;
  toggle: () => void;
  user: UserModel;
  onSuccess?: () => void;
}

/**
 * Modal para asignar roles y permisos a un usuario
 * Permite asignar N roles o N permisos directos
 */
const UserRolesPermissionsModal: React.FC<UserRolesPermissionsModalProps> = ({
  isOpen,
  toggle,
  user,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const [saving, setSaving] = useState(false);

  // TODO: Estados para cuando se configuren roles y permisos
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

  /**
   * Inicializar estados con los datos actuales del usuario
   */
  useEffect(() => {
    if (isOpen) {
      setSelectedRoleIds(user.roleIds || []);
      setSelectedPermissionIds(user.permissionIds || []);
      setActiveTab('roles');
    }
  }, [isOpen, user]);

  /**
   * Guardar cambios
   */
  const handleSave = async () => {
    setSaving(true);

    try {
      // Simular guardado en backend
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Calcular cambios
      const addedRoles = selectedRoleIds.filter(id => !(user.roleIds || []).includes(id));
      const removedRoles = (user.roleIds || []).filter(id => !selectedRoleIds.includes(id));
      const addedPermissions = selectedPermissionIds.filter(id => !(user.permissionIds || []).includes(id));
      const removedPermissions = (user.permissionIds || []).filter(id => !selectedPermissionIds.includes(id));

      // Mostrar resumen de cambios
      const totalChanges = addedRoles.length + removedRoles.length + addedPermissions.length + removedPermissions.length;

      if (totalChanges === 0) {
        toast.info('ℹ️ No se realizaron cambios', {
          position: 'top-right',
          autoClose: 2000,
        });
      } else {
        toast.success(
          `✅ Asignación actualizada: ${selectedRoleIds.length} rol(es), ${selectedPermissionIds.length} permiso(s) directo(s)`,
          {
            position: 'top-right',
            autoClose: 3000,
          }
        );
      }

      onSuccess?.();
      toggle();
    } catch (error) {
      toast.error('❌ Error al guardar. Intente nuevamente.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Calcular contadores para badges
   */
  const rolesCount = {
    current: user.roleIds?.length || 0,
    selected: selectedRoleIds.length,
    changed: selectedRoleIds.length !== (user.roleIds?.length || 0),
  };

  const permissionsCount = {
    current: user.permissionIds?.length || 0,
    selected: selectedPermissionIds.length,
    changed: selectedPermissionIds.length !== (user.permissionIds?.length || 0),
    inherited: 0, // TODO: Calcular cuando se configuren roles
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" scrollable>
      <ModalHeader toggle={toggle}>
        <div className="d-flex align-items-center">
          <i className="mdi mdi-shield-account font-size-20 me-2 text-primary"></i>
          <div>
            <h5 className="mb-0">Gestionar Accesos</h5>
            <small className="text-muted">{user.fullName}</small>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        {/* Info Alert */}
        <Alert color="info" className="mb-3">
          <i className="mdi mdi-information me-2"></i>
          <strong>Importante:</strong> Los usuarios pueden tener <strong>N roles</strong> y/o{' '}
          <strong>N permisos directos</strong>. Los permisos heredados de roles se marcan con{' '}
          <Badge color="secondary" className="ms-1">
            Heredado
          </Badge>
        </Alert>

        {/* Tabs */}
        <Nav tabs className="nav-tabs-custom">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'roles' })}
              onClick={() => setActiveTab('roles')}
              style={{ cursor: 'pointer' }}
            >
              <i className="mdi mdi-shield-crown me-1"></i>
              Roles{' '}
              <Badge color={rolesCount.changed ? 'warning' : 'secondary'} className="ms-1">
                {rolesCount.selected}
              </Badge>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'permissions' })}
              onClick={() => setActiveTab('permissions')}
              style={{ cursor: 'pointer' }}
            >
              <i className="mdi mdi-key-variant me-1"></i>
              Permisos Directos{' '}
              <Badge color={permissionsCount.changed ? 'warning' : 'secondary'} className="ms-1">
                {permissionsCount.selected}
              </Badge>
              {permissionsCount.inherited > 0 && (
                <Badge color="secondary" className="ms-1">
                  +{permissionsCount.inherited} heredados
                </Badge>
              )}
            </NavLink>
          </NavItem>
        </Nav>

        {/* Tab Content */}
        <TabContent activeTab={activeTab} className="pt-3">
          {/* TAB: ROLES */}
          <TabPane tabId="roles">
            <div className="mb-3">
              <p className="text-muted">
                Selecciona los roles que deseas asignar a este usuario. Los permisos se heredarán automáticamente.
              </p>
            </div>

            {/* TODO: Mostrar roles cuando se configuren */}
            <div className="text-center py-4">
              <i className="mdi mdi-shield-off-outline display-4 text-muted"></i>
              <p className="text-muted mt-2">Roles pendientes de configuración</p>
            </div>
          </TabPane>

          {/* TAB: PERMISOS DIRECTOS */}
          <TabPane tabId="permissions">
            <div className="mb-3">
              <p className="text-muted">
                Asigna permisos específicos sin necesidad de asignar un rol completo.
              </p>
            </div>

            {/* TODO: Mostrar permisos cuando se configuren */}
            <div className="text-center py-4">
              <i className="mdi mdi-key-off-outline display-4 text-muted"></i>
              <p className="text-muted mt-2">Permisos pendientes de configuración</p>
            </div>
          </TabPane>
        </TabContent>

        {/* Resumen de cambios */}
        {(rolesCount.changed || permissionsCount.changed) && (
          <Alert color="warning" className="mt-3 mb-0">
            <i className="mdi mdi-alert-outline me-2"></i>
            <strong>Cambios pendientes:</strong>{' '}
            {rolesCount.changed && (
              <span>
                Roles: {rolesCount.current} → {rolesCount.selected}
              </span>
            )}
            {rolesCount.changed && permissionsCount.changed && ' | '}
            {permissionsCount.changed && (
              <span>
                Permisos directos: {permissionsCount.current} → {permissionsCount.selected}
              </span>
            )}
          </Alert>
        )}
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={saving}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <i className="mdi mdi-loading mdi-spin me-1"></i>
              Guardando...
            </>
          ) : (
            <>
              <i className="mdi mdi-check me-1"></i>
              Guardar Cambios
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UserRolesPermissionsModal;
