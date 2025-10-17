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
  Card,
  CardBody,
  Badge,
  Input,
  Label,
  Row,
  Col,
  Alert,
} from 'reactstrap';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { UserModel } from '../models/UserModel';
import { MOCK_ROLES } from '../../Roles/data/mockRoles';
import { groupPermissionsByModule } from '../../Roles/data/mockPermissions';

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

  // Estado para roles seleccionados
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  // Estado para permisos seleccionados (solo permisos directos)
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

  // Estado para expandir/colapsar módulos de permisos
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Permisos agrupados por módulo
  const permissionsByModule = groupPermissionsByModule();

  /**
   * Inicializar estados con los datos actuales del usuario
   */
  useEffect(() => {
    if (isOpen) {
      setSelectedRoleIds(user.roleIds || []);
      setSelectedPermissionIds(user.permissionIds || []);
      setActiveTab('roles');

      // Expandir todos los módulos por defecto
      const initialExpanded: Record<string, boolean> = {};
      permissionsByModule.forEach(group => {
        initialExpanded[group.module] = true;
      });
      setExpandedModules(initialExpanded);
    }
  }, [isOpen, user]);

  /**
   * Toggle selección de rol
   */
  const handleToggleRole = (roleId: number) => {
    setSelectedRoleIds(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  /**
   * Toggle selección de permiso directo
   */
  const handleTogglePermission = (permissionId: number) => {
    setSelectedPermissionIds(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  /**
   * Toggle expandir/colapsar módulo de permisos
   */
  const handleToggleModule = (module: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  /**
   * Seleccionar/Deseleccionar todos los permisos de un módulo
   */
  const handleToggleModulePermissions = (module: string, permissionIds: number[]) => {
    const allSelected = permissionIds.every(id => selectedPermissionIds.includes(id));

    if (allSelected) {
      // Deseleccionar todos
      setSelectedPermissionIds(prev => prev.filter(id => !permissionIds.includes(id)));
    } else {
      // Seleccionar todos
      setSelectedPermissionIds(prev => {
        const newIds = permissionIds.filter(id => !prev.includes(id));
        return [...prev, ...newIds];
      });
    }
  };

  /**
   * Obtener permisos heredados de los roles seleccionados
   */
  const getInheritedPermissions = (): number[] => {
    const selectedRoles = MOCK_ROLES.filter(role => selectedRoleIds.includes(role.id));
    const inheritedPermissionIds = selectedRoles.flatMap(role => role.permissionIds);

    // Eliminar duplicados
    return Array.from(new Set(inheritedPermissionIds));
  };

  /**
   * Verificar si un permiso está heredado de algún rol
   */
  const isPermissionInherited = (permissionId: number): boolean => {
    return getInheritedPermissions().includes(permissionId);
  };

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
    inherited: getInheritedPermissions().length,
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

            {MOCK_ROLES.filter(role => role.isActive).map(role => {
              const isSelected = selectedRoleIds.includes(role.id);

              return (
                <Card
                  key={role.id}
                  className={`mb-2 ${isSelected ? 'border-primary' : ''}`}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => handleToggleRole(role.id)}
                >
                  <CardBody className="p-3">
                    <Row className="align-items-center">
                      <Col xs="auto">
                        <Input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRole(role.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="form-check-input"
                          style={{ cursor: 'pointer' }}
                        />
                      </Col>
                      <Col>
                        <div className="d-flex align-items-center">
                          <i className="mdi mdi-shield-crown font-size-18 text-primary me-2"></i>
                          <div>
                            <h6 className="mb-0">{role.name}</h6>
                            <small className="text-muted">{role.description}</small>
                          </div>
                        </div>
                      </Col>
                      <Col xs="auto">
                        <Badge color="info" pill>
                          {role.permissionIds.length} permisos
                        </Badge>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              );
            })}

            {/* Empty state */}
            {MOCK_ROLES.filter(role => role.isActive).length === 0 && (
              <div className="text-center py-4">
                <i className="mdi mdi-shield-off-outline display-4 text-muted"></i>
                <p className="text-muted mt-2">No hay roles activos disponibles</p>
              </div>
            )}
          </TabPane>

          {/* TAB: PERMISOS DIRECTOS */}
          <TabPane tabId="permissions">
            <div className="mb-3">
              <p className="text-muted">
                Asigna permisos específicos sin necesidad de asignar un rol completo.
              </p>
            </div>

            {/* Permisos agrupados por módulo */}
            {permissionsByModule.map(group => {
              const modulePermissionIds = group.permissions.map(p => p.id);
              const selectedInModule = modulePermissionIds.filter(id =>
                selectedPermissionIds.includes(id)
              ).length;
              const inheritedInModule = modulePermissionIds.filter(id =>
                isPermissionInherited(id) && !selectedPermissionIds.includes(id)
              ).length;
              const isExpanded = expandedModules[group.module];

              return (
                <Card key={group.module} className="mb-2">
                  <CardBody className="p-3">
                    {/* Encabezado del módulo */}
                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleToggleModule(group.module)}
                    >
                      <div className="d-flex align-items-center flex-grow-1">
                        <i className={`${group.moduleIcon} font-size-18 me-2 text-primary`}></i>
                        <h6 className="mb-0">{group.module}</h6>
                        <div className="ms-3">
                          {selectedInModule > 0 && (
                            <Badge color="primary" pill className="me-1">
                              {selectedInModule} directo{selectedInModule !== 1 ? 's' : ''}
                            </Badge>
                          )}
                          {inheritedInModule > 0 && (
                            <Badge color="secondary" pill>
                              {inheritedInModule} heredado{inheritedInModule !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        {/* Checkbox para seleccionar todos del módulo */}
                        <Input
                          type="checkbox"
                          checked={
                            modulePermissionIds.every(id => selectedPermissionIds.includes(id))
                          }
                          indeterminate={
                            modulePermissionIds.some(id => selectedPermissionIds.includes(id)) &&
                            !modulePermissionIds.every(id => selectedPermissionIds.includes(id))
                          }
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleModulePermissions(group.module, modulePermissionIds);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="form-check-input me-3"
                          style={{ cursor: 'pointer' }}
                          title="Seleccionar todos"
                        />
                        <i
                          className={`mdi mdi-chevron-${isExpanded ? 'up' : 'down'} font-size-20`}
                        ></i>
                      </div>
                    </div>

                    {/* Lista de permisos (colapsable) */}
                    {isExpanded && (
                      <div className="mt-3 ps-4">
                        {group.permissions.map(permission => {
                          const isSelected = selectedPermissionIds.includes(permission.id);
                          const isInherited = isPermissionInherited(permission.id);

                          return (
                            <div
                              key={permission.id}
                              className="d-flex align-items-center py-2 border-bottom"
                            >
                              <Input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleTogglePermission(permission.id)}
                                className="form-check-input me-3"
                                style={{ cursor: 'pointer' }}
                                disabled={!permission.isActive}
                              />
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center">
                                  <code className="text-primary me-2">{permission.slug}</code>
                                  {isInherited && (
                                    <Badge color="secondary" className="me-2">
                                      Heredado
                                    </Badge>
                                  )}
                                  {!permission.isActive && (
                                    <Badge color="danger">Inactivo</Badge>
                                  )}
                                </div>
                                <small className="text-muted">{permission.description}</small>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })}
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
