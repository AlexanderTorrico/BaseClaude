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
  Input,
  Collapse,
  Spinner,
  FormGroup,
  Label,
} from 'reactstrap';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { UserModel } from '../models/UserModel';
import { PermissionModel } from '../../Permissions/models/PermissionModel';
import { PermissionApiService } from '../../Permissions/services/PermissionApiService';

interface UserRolesPermissionsModalProps {
  isOpen: boolean;
  toggle: () => void;
  user: UserModel;
  onSuccess?: () => void;
}

interface GroupedPermissions {
  [moduleName: string]: {
    module: {
      id: number;
      name: string;
      description?: string;
      icon?: string;
    };
    permissions: PermissionModel[];
  };
}

const permissionService = new PermissionApiService();

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
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  // Estados para roles y permisos
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

  // Permisos agrupados por módulo
  const [allPermissions, setAllPermissions] = useState<PermissionModel[]>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<GroupedPermissions>({});
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  /**
   * Cargar permisos cuando se abre el modal
   */
  useEffect(() => {
    if (isOpen) {
      setSelectedRoleIds(user.roleIds || []);
      setSelectedPermissionIds(user.permissionIds || []);
      setActiveTab('roles');
      fetchPermissions();
    }
  }, [isOpen, user]);

  /**
   * Obtener todos los permisos y agruparlos por módulo
   */
  const fetchPermissions = async () => {
    setLoadingPermissions(true);
    try {
      const result = await permissionService.getAllPermissions();
      if (result.data) {
        setAllPermissions(result.data);
        groupPermissionsByModule(result.data);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Error al cargar los permisos');
    } finally {
      setLoadingPermissions(false);
    }
  };

  /**
   * Agrupar permisos por módulo
   */
  const groupPermissionsByModule = (permissions: PermissionModel[]) => {
    const grouped: GroupedPermissions = {};

    permissions.forEach(permission => {
      const moduleName = permission.module?.name || 'Sin Módulo';

      if (!grouped[moduleName]) {
        grouped[moduleName] = {
          module: {
            id: permission.module?.id || 0,
            name: moduleName,
            description: permission.module?.description,
            icon: permission.module?.icon || 'mdi mdi-folder',
          },
          permissions: [],
        };
      }

      grouped[moduleName].permissions.push(permission);
    });

    setGroupedPermissions(grouped);
  };

  /**
   * Toggle expansión de un módulo
   */
  const toggleModule = (moduleName: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleName)
        ? prev.filter(m => m !== moduleName)
        : [...prev, moduleName]
    );
  };

  /**
   * Toggle un permiso individual
   */
  const togglePermission = (permissionId: number) => {
    setSelectedPermissionIds(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  /**
   * Toggle todos los permisos de un módulo
   */
  const toggleAllModulePermissions = (moduleName: string, checked: boolean) => {
    const modulePermissionIds = groupedPermissions[moduleName]?.permissions.map(p => p.id) || [];

    if (checked) {
      setSelectedPermissionIds(prev => [...new Set([...prev, ...modulePermissionIds])]);
    } else {
      setSelectedPermissionIds(prev => prev.filter(id => !modulePermissionIds.includes(id)));
    }
  };

  /**
   * Verificar si todos los permisos de un módulo están seleccionados
   */
  const isModuleFullySelected = (moduleName: string): boolean => {
    const modulePermissionIds = groupedPermissions[moduleName]?.permissions.map(p => p.id) || [];
    return modulePermissionIds.length > 0 && modulePermissionIds.every(id => selectedPermissionIds.includes(id));
  };

  /**
   * Verificar si algunos permisos de un módulo están seleccionados
   */
  const isModulePartiallySelected = (moduleName: string): boolean => {
    const modulePermissionIds = groupedPermissions[moduleName]?.permissions.map(p => p.id) || [];
    const selectedCount = modulePermissionIds.filter(id => selectedPermissionIds.includes(id)).length;
    return selectedCount > 0 && selectedCount < modulePermissionIds.length;
  };

  /**
   * Contar permisos seleccionados de un módulo
   */
  const getModuleSelectedCount = (moduleName: string): number => {
    const modulePermissionIds = groupedPermissions[moduleName]?.permissions.map(p => p.id) || [];
    return modulePermissionIds.filter(id => selectedPermissionIds.includes(id)).length;
  };

  /**
   * Guardar cambios
   */
  const handleSave = async () => {
    setSaving(true);

    try {
      // Calcular cambios en permisos
      const currentPermissionIds = user.permissionIds || [];
      const addedPermissions = selectedPermissionIds.filter(id => !currentPermissionIds.includes(id));
      const removedPermissions = currentPermissionIds.filter(id => !selectedPermissionIds.includes(id));

      // Calcular cambios en roles (para el futuro)
      const addedRoles = selectedRoleIds.filter(id => !(user.roleIds || []).includes(id));
      const removedRoles = (user.roleIds || []).filter(id => !selectedRoleIds.includes(id));

      const totalChanges = addedRoles.length + removedRoles.length + addedPermissions.length + removedPermissions.length;

      if (totalChanges === 0) {
        toast.info('ℹ️ No se realizaron cambios', {
          position: 'top-right',
          autoClose: 2000,
        });
        toggle();
        return;
      }

      // Asignar nuevos permisos
      for (const permissionId of addedPermissions) {
        const result = await permissionService.assignPermissionToUser(user.uuid, permissionId, false);
        if (result.status !== 200 && result.status !== 201) {
          console.error(`Error asignando permiso ${permissionId}:`, result.message);
        }
      }

      // Remover permisos quitados
      for (const permissionId of removedPermissions) {
        const result = await permissionService.removePermissionFromUser(user.uuid, permissionId);
        if (result.status !== 200 && result.status !== 201) {
          console.error(`Error removiendo permiso ${permissionId}:`, result.message);
        }
      }

      toast.success(
        `✅ Permisos actualizados: +${addedPermissions.length} asignados, -${removedPermissions.length} removidos`,
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );

      onSuccess?.();
      toggle();
    } catch (error) {
      console.error('Error al guardar permisos:', error);
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

            {loadingPermissions ? (
              <div className="text-center py-4">
                <Spinner color="primary" />
                <p className="text-muted mt-2">Cargando permisos...</p>
              </div>
            ) : Object.keys(groupedPermissions).length === 0 ? (
              <div className="text-center py-4">
                <i className="mdi mdi-key-off-outline display-4 text-muted"></i>
                <p className="text-muted mt-2">No hay permisos disponibles</p>
              </div>
            ) : (
              <div className="permissions-accordion">
                {Object.entries(groupedPermissions).map(([moduleName, moduleData]) => {
                  const isExpanded = expandedModules.includes(moduleName);
                  const isFullySelected = isModuleFullySelected(moduleName);
                  const isPartiallySelected = isModulePartiallySelected(moduleName);
                  const selectedCount = getModuleSelectedCount(moduleName);
                  const totalCount = moduleData.permissions.length;

                  return (
                    <div key={moduleName} className="border rounded mb-2">
                      {/* Module Header */}
                      <div
                        className="d-flex align-items-center p-3 bg-light"
                        style={{ cursor: 'pointer' }}
                      >
                        <FormGroup check className="mb-0 me-3">
                          <Input
                            type="checkbox"
                            checked={isFullySelected}
                            ref={(input) => {
                              if (input) {
                                input.indeterminate = isPartiallySelected;
                              }
                            }}
                            onChange={(e) => toggleAllModulePermissions(moduleName, e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </FormGroup>
                        <div
                          className="d-flex align-items-center flex-grow-1"
                          onClick={() => toggleModule(moduleName)}
                        >
                          <i className={`${moduleData.module.icon} font-size-18 me-2 text-primary`}></i>
                          <div className="flex-grow-1">
                            <span className="fw-medium">{moduleName}</span>
                            {moduleData.module.description && (
                              <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>
                                {moduleData.module.description.substring(0, 60)}
                                {moduleData.module.description.length > 60 ? '...' : ''}
                              </small>
                            )}
                          </div>
                          <Badge color={selectedCount > 0 ? 'primary' : 'secondary'} className="me-2">
                            {selectedCount}/{totalCount}
                          </Badge>
                          <i className={`mdi ${isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'} font-size-18`}></i>
                        </div>
                      </div>

                      {/* Permissions List */}
                      <Collapse isOpen={isExpanded}>
                        <hr className="my-1 mx-3" style={{ borderColor: 'rgba(0,0,0,0.08)' }} />
                        <div className="p-3 pt-0">
                          {moduleData.permissions.map(permission => {
                            const isSelected = selectedPermissionIds.includes(permission.id);

                            return (
                              <div
                                key={permission.id}
                                className={`d-flex align-items-start p-2 rounded mb-1 ${isSelected ? 'bg-primary bg-opacity-10' : 'hover-bg-light'}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => togglePermission(permission.id)}
                              >
                                <FormGroup check className="mb-0 me-3">
                                  <Input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => { }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </FormGroup>
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center">
                                    <span className="fw-medium">{permission.namePublic || permission.name}</span>
                                  </div>
                                  {permission.description && (
                                    <small className="text-muted d-block mt-1">
                                      {permission.description}
                                    </small>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Collapse>
                    </div>
                  );
                })}
              </div>
            )}
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
