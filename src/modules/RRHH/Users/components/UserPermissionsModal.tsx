import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Badge,
    Alert,
    Input,
    Collapse,
    Spinner,
    FormGroup,
} from 'reactstrap';
import { toast } from 'react-toastify';
import { UserModel } from '../models/UserModel';
import { PermissionModel } from '../../Permissions/models/PermissionModel';
import { PermissionApiService } from '../../Permissions/services/PermissionApiService';

interface UserPermissionsModalProps {
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
 * Modal para asignar permisos directos a un usuario
 */
const UserPermissionsModal: React.FC<UserPermissionsModalProps> = ({
    isOpen,
    toggle,
    user,
    onSuccess,
}) => {
    const [saving, setSaving] = useState(false);
    const [loadingPermissions, setLoadingPermissions] = useState(false);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
    const [groupedPermissions, setGroupedPermissions] = useState<GroupedPermissions>({});
    const [expandedModules, setExpandedModules] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setSelectedPermissionIds(user.permissionIds || []);
            fetchPermissions();
        }
    }, [isOpen, user]);

    const fetchPermissions = async () => {
        setLoadingPermissions(true);
        try {
            const result = await permissionService.getAllPermissions();
            if (result.data) {
                groupPermissionsByModule(result.data);
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
            toast.error('Error al cargar los permisos');
        } finally {
            setLoadingPermissions(false);
        }
    };

    const groupPermissionsByModule = (permissions: PermissionModel[]) => {
        const grouped: GroupedPermissions = {};

        permissions.forEach(permission => {
            const moduleName = permission.module?.name || 'Sin Módulo';

            if (!grouped[moduleName]) {
                grouped[moduleName] = {
                    module: {
                        id: permission.module?.id || 0,
                        name: moduleName,
                        description: permission.module?.description || '',
                        icon: permission.module?.icon || 'mdi mdi-folder',
                    },
                    permissions: [],
                };
            }

            grouped[moduleName].permissions.push(permission);
        });

        setGroupedPermissions(grouped);
    };

    const toggleModule = (moduleName: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleName)
                ? prev.filter(m => m !== moduleName)
                : [...prev, moduleName]
        );
    };

    const togglePermission = (permissionId: number) => {
        setSelectedPermissionIds(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const toggleAllModulePermissions = (moduleName: string, checked: boolean) => {
        const modulePermissionIds = groupedPermissions[moduleName]?.permissions.map(p => p.id) || [];

        if (checked) {
            setSelectedPermissionIds(prev => [...new Set([...prev, ...modulePermissionIds])]);
        } else {
            setSelectedPermissionIds(prev => prev.filter(id => !modulePermissionIds.includes(id)));
        }
    };

    const isModuleFullySelected = (moduleName: string): boolean => {
        const modulePermissionIds = groupedPermissions[moduleName]?.permissions.map(p => p.id) || [];
        return modulePermissionIds.length > 0 && modulePermissionIds.every(id => selectedPermissionIds.includes(id));
    };

    const isModulePartiallySelected = (moduleName: string): boolean => {
        const modulePermissionIds = groupedPermissions[moduleName]?.permissions.map(p => p.id) || [];
        const selectedCount = modulePermissionIds.filter(id => selectedPermissionIds.includes(id)).length;
        return selectedCount > 0 && selectedCount < modulePermissionIds.length;
    };

    const getModuleSelectedCount = (moduleName: string): number => {
        const modulePermissionIds = groupedPermissions[moduleName]?.permissions.map(p => p.id) || [];
        return modulePermissionIds.filter(id => selectedPermissionIds.includes(id)).length;
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const originalIds = user.permissionIds || [];
            const addedPermissions = selectedPermissionIds.filter(id => !originalIds.includes(id));
            const removedPermissions = originalIds.filter(id => !selectedPermissionIds.includes(id));

            if (addedPermissions.length === 0 && removedPermissions.length === 0) {
                toast.info('✓ No hay cambios que guardar', { autoClose: 2000 });
                toggle();
                return;
            }

            for (const permissionId of addedPermissions) {
                const result = await permissionService.assignPermissionToUser(user.uuid, permissionId, false);
                if (result.status !== 200 && result.status !== 201) {
                    console.error(`Error asignando permiso ${permissionId}:`, result.message);
                }
            }

            for (const permissionId of removedPermissions) {
                const result = await permissionService.removePermissionFromUser(user.uuid, permissionId);
                if (result.status !== 200 && result.status !== 201) {
                    console.error(`Error removiendo permiso ${permissionId}:`, result.message);
                }
            }

            toast.success(
                `✅ Permisos actualizados: +${addedPermissions.length} asignados, -${removedPermissions.length} removidos`,
                { autoClose: 3000 }
            );

            onSuccess?.();
            toggle();
        } catch (error) {
            console.error('Error al guardar permisos:', error);
            toast.error('❌ Error al guardar. Intente nuevamente.');
        } finally {
            setSaving(false);
        }
    };

    const permissionsChanged = selectedPermissionIds.length !== (user.permissionIds?.length || 0) ||
        !selectedPermissionIds.every(id => (user.permissionIds || []).includes(id));

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg" scrollable>
            <ModalHeader toggle={toggle}>
                <div className="d-flex align-items-center">
                    <i className="mdi mdi-key-variant font-size-20 me-2 text-primary"></i>
                    <div>
                        <h5 className="mb-0">Gestionar Permisos</h5>
                        <small className="text-muted">{user.fullName}</small>
                    </div>
                </div>
            </ModalHeader>

            <ModalBody>
                <Alert color="info" className="mb-3">
                    <i className="mdi mdi-information me-2"></i>
                    Asigna permisos específicos a este usuario. Los permisos seleccionados se aplicarán directamente.
                </Alert>

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
                                    <div className="d-flex align-items-center p-3 bg-light" style={{ cursor: 'pointer' }}>
                                        <FormGroup check className="mb-0 me-3">
                                            <Input
                                                type="checkbox"
                                                checked={isFullySelected}
                                                ref={(input) => {
                                                    if (input) {
                                                        (input as any).indeterminate = isPartiallySelected;
                                                    }
                                                }}
                                                onChange={(e) => toggleAllModulePermissions(moduleName, e.target.checked)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </FormGroup>
                                        <div className="d-flex align-items-center flex-grow-1" onClick={() => toggleModule(moduleName)}>
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

                {permissionsChanged && (
                    <Alert color="warning" className="mt-3 mb-0">
                        <i className="mdi mdi-alert-outline me-2"></i>
                        <strong>Cambios pendientes:</strong>{' '}
                        Permisos: {user.permissionIds?.length || 0} → {selectedPermissionIds.length}
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

export default UserPermissionsModal;
