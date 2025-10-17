import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Badge,
  Spinner,
  Row,
  Col,
} from 'reactstrap';
import { toast } from 'react-toastify';
import { RoleModel } from '../models/RoleModel';
import { groupPermissionsByModule } from '../data/mockPermissions';
import { PermissionsByModule } from '../models/PermissionModel';

interface RolePermissionsModalProps {
  isOpen: boolean;
  toggle: () => void;
  role: RoleModel;
  onSuccess: () => void;
}

/**
 * Modal para asignar/remover permisos a un rol
 * Los permisos se muestran agrupados por módulo (RRHH, Productos, etc.)
 */
const RolePermissionsModal: React.FC<RolePermissionsModalProps> = ({
  isOpen,
  toggle,
  role,
  onSuccess,
}) => {
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [permissionsByModule, setPermissionsByModule] = useState<PermissionsByModule[]>([]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  /**
   * Inicializar permisos al abrir el modal
   */
  useEffect(() => {
    if (isOpen) {
      // Cargar permisos agrupados por módulo
      const grouped = groupPermissionsByModule();
      setPermissionsByModule(grouped);

      // Pre-seleccionar permisos que ya tiene el rol
      setSelectedPermissionIds([...role.permissionIds]);

      // Expandir todos los módulos por defecto
      setExpandedModules(grouped.map(g => g.module));
    }
  }, [isOpen, role]);

  /**
   * Toggle de selección de un permiso individual
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
   * Seleccionar/Deseleccionar todos los permisos de un módulo
   */
  const handleToggleModule = (module: PermissionsByModule) => {
    const modulePermissionIds = module.permissions.map(p => p.id);
    const allSelected = modulePermissionIds.every(id => selectedPermissionIds.includes(id));

    if (allSelected) {
      // Deseleccionar todos los permisos del módulo
      setSelectedPermissionIds(prev =>
        prev.filter(id => !modulePermissionIds.includes(id))
      );
    } else {
      // Seleccionar todos los permisos del módulo
      setSelectedPermissionIds(prev => [
        ...prev.filter(id => !modulePermissionIds.includes(id)),
        ...modulePermissionIds,
      ]);
    }
  };

  /**
   * Toggle expandir/colapsar módulo
   */
  const handleToggleExpand = (moduleName: string) => {
    setExpandedModules(prev => {
      if (prev.includes(moduleName)) {
        return prev.filter(m => m !== moduleName);
      } else {
        return [...prev, moduleName];
      }
    });
  };

  /**
   * Calcular cuántos permisos de un módulo están seleccionados
   */
  const getModuleSelectedCount = (module: PermissionsByModule): number => {
    return module.permissions.filter(p => selectedPermissionIds.includes(p.id)).length;
  };

  /**
   * Verificar si todos los permisos de un módulo están seleccionados
   */
  const isModuleFullySelected = (module: PermissionsByModule): boolean => {
    return module.permissions.every(p => selectedPermissionIds.includes(p.id));
  };

  /**
   * Guardar cambios de permisos
   */
  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Simular guardado en backend (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular éxito
      toast.success(`✅ Permisos del rol "${role.name}" actualizados exitosamente`, {
        position: 'top-right',
        autoClose: 3000,
      });

      // Llamar callback de éxito
      onSuccess();
      toggle();
    } catch (error) {
      toast.error('❌ Error al guardar permisos. Intente nuevamente.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Calcular cambios realizados
   */
  const getChangesCount = (): { added: number; removed: number } => {
    const originalIds = role.permissionIds;
    const currentIds = selectedPermissionIds;

    const added = currentIds.filter(id => !originalIds.includes(id)).length;
    const removed = originalIds.filter(id => !currentIds.includes(id)).length;

    return { added, removed };
  };

  const changes = getChangesCount();
  const hasChanges = changes.added > 0 || changes.removed > 0;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl" backdrop="static" scrollable>
      <ModalHeader toggle={toggle}>
        <div className="d-flex align-items-center gap-2">
          <i className="mdi mdi-key-variant font-size-20 text-primary"></i>
          <div>
            <div>Permisos del Rol: <strong>{role.name}</strong></div>
            <small className="text-muted">
              {selectedPermissionIds.length} de {permissionsByModule.reduce((sum, m) => sum + m.totalPermissions, 0)} permisos seleccionados
            </small>
          </div>
        </div>
      </ModalHeader>

      <ModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {/* Resumen de cambios */}
        {hasChanges && (
          <div className="alert alert-warning mb-3">
            <div className="d-flex align-items-center gap-2">
              <i className="mdi mdi-alert-outline font-size-18"></i>
              <div>
                <strong>Cambios pendientes:</strong>
                {changes.added > 0 && <span className="ms-2 text-success">+{changes.added} agregados</span>}
                {changes.removed > 0 && <span className="ms-2 text-danger">-{changes.removed} removidos</span>}
              </div>
            </div>
          </div>
        )}

        {/* Permisos agrupados por módulo */}
        <div className="vstack gap-3">
          {permissionsByModule.map((module) => {
            const isExpanded = expandedModules.includes(module.module);
            const selectedCount = getModuleSelectedCount(module);
            const isFullySelected = isModuleFullySelected(module);

            return (
              <Card key={module.module} className="shadow-sm">
                <CardBody>
                  {/* Header del módulo */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2 flex-grow-1">
                      {/* Checkbox para seleccionar todos */}
                      <Input
                        type="checkbox"
                        checked={isFullySelected}
                        onChange={() => handleToggleModule(module)}
                        disabled={isSaving}
                        style={{ width: '18px', height: '18px' }}
                      />

                      {/* Icono y nombre del módulo */}
                      <div
                        className="d-flex align-items-center gap-2 cursor-pointer flex-grow-1"
                        onClick={() => handleToggleExpand(module.module)}
                      >
                        <div
                          className="avatar-sm bg-soft-primary rounded d-flex align-items-center justify-content-center"
                          style={{ width: '40px', height: '40px' }}
                        >
                          <i className={`${module.moduleIcon} font-size-20 text-primary`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2">
                            <h5 className="mb-0">{module.module}</h5>
                            <Badge color={selectedCount > 0 ? 'primary' : 'secondary'} pill>
                              {selectedCount}/{module.totalPermissions}
                            </Badge>
                          </div>
                          <small className="text-muted">
                            {selectedCount === 0 && 'Ningún permiso seleccionado'}
                            {selectedCount > 0 && selectedCount < module.totalPermissions && `${selectedCount} permisos seleccionados`}
                            {selectedCount === module.totalPermissions && 'Todos los permisos seleccionados'}
                          </small>
                        </div>
                        <i className={`mdi mdi-chevron-${isExpanded ? 'up' : 'down'} font-size-20 text-muted`}></i>
                      </div>
                    </div>
                  </div>

                  {/* Lista de permisos del módulo */}
                  {isExpanded && (
                    <div className="border-top pt-3">
                      <Row>
                        {module.permissions.map((permission) => {
                          const isSelected = selectedPermissionIds.includes(permission.id);

                          return (
                            <Col key={permission.id} md={6} className="mb-3">
                              <div
                                className={`p-3 border rounded cursor-pointer transition ${
                                  isSelected ? 'bg-soft-primary border-primary' : 'bg-light'
                                }`}
                                onClick={() => handleTogglePermission(permission.id)}
                              >
                                <div className="d-flex align-items-start gap-2">
                                  <Input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleTogglePermission(permission.id)}
                                    disabled={isSaving}
                                    style={{ width: '18px', height: '18px', marginTop: '2px' }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div className="flex-grow-1">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                      <strong className="text-dark">{permission.name}</strong>
                                      {isSelected && (
                                        <i className="mdi mdi-check-circle text-primary"></i>
                                      )}
                                    </div>
                                    <div className="text-muted small mb-1">
                                      <code className="text-info">{permission.slug}</code>
                                    </div>
                                    <small className="text-muted">{permission.description}</small>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="d-flex align-items-center justify-content-between w-100">
          {/* Info de permisos seleccionados */}
          <div className="text-muted">
            <strong>{selectedPermissionIds.length}</strong> permisos seleccionados
          </div>

          {/* Botones de acción */}
          <div className="d-flex gap-2">
            <Button
              color="secondary"
              onClick={toggle}
              disabled={isSaving}
              outline
            >
              <i className="mdi mdi-close me-1"></i>
              Cancelar
            </Button>
            <Button
              color="primary"
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
            >
              {isSaving ? (
                <>
                  <Spinner size="sm" className="me-1" />
                  Guardando...
                </>
              ) : (
                <>
                  <i className="mdi mdi-content-save me-1"></i>
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default RolePermissionsModal;
