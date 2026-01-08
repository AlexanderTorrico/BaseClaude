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
    Spinner,
    FormGroup,
} from 'reactstrap';
import { toast } from 'react-toastify';
import { UserModel } from '../models/UserModel';
import { RoleModel } from '../../Roles/models/RoleModel';
import { RoleApiService } from '../../Roles/services/RoleApiService';

interface UserRolesModalProps {
    isOpen: boolean;
    toggle: () => void;
    user: UserModel;
    onSuccess?: () => void;
}

const roleService = new RoleApiService();

/**
 * Modal para asignar roles a un usuario
 */
const UserRolesModal: React.FC<UserRolesModalProps> = ({
    isOpen,
    toggle,
    user,
    onSuccess,
}) => {
    const [saving, setSaving] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [allRoles, setAllRoles] = useState<RoleModel[]>([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

    useEffect(() => {
        if (isOpen) {
            setSelectedRoleIds(user.roleIds || []);
            fetchRoles();
        }
    }, [isOpen, user]);

    const fetchRoles = async () => {
        setLoadingRoles(true);
        try {
            const result = await roleService.getAllRoles();
            if (result.data) {
                setAllRoles(result.data);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.error('Error al cargar los roles');
        } finally {
            setLoadingRoles(false);
        }
    };

    const toggleRole = (roleId: number) => {
        setSelectedRoleIds(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const originalIds = user.roleIds || [];
            const addedRoles = selectedRoleIds.filter(id => !originalIds.includes(id));
            const removedRoles = originalIds.filter(id => !selectedRoleIds.includes(id));

            if (addedRoles.length === 0 && removedRoles.length === 0) {
                toast.info('✓ No hay cambios que guardar', { autoClose: 2000 });
                toggle();
                return;
            }

            // Verificar que el usuario tenga un ID numérico para las llamadas API
            if (!user.id) {
                toast.error('❌ Error: El usuario no tiene un ID válido');
                return;
            }

            // Asignar nuevos roles
            for (const roleId of addedRoles) {
                const result = await roleService.assignRoleToUser(roleId, user.id);
                if (result.status !== 200 && result.status !== 201) {
                    console.error(`Error asignando rol ${roleId}:`, result.message);
                }
            }

            // Remover roles quitados
            for (const roleId of removedRoles) {
                const result = await roleService.removeRoleFromUser(roleId, user.id);
                if (result.status !== 200 && result.status !== 201) {
                    console.error(`Error removiendo rol ${roleId}:`, result.message);
                }
            }

            toast.success(
                `✅ Roles actualizados: +${addedRoles.length} asignados, -${removedRoles.length} removidos`,
                { autoClose: 3000 }
            );

            onSuccess?.();
            toggle();
        } catch (error) {
            console.error('Error al guardar roles:', error);
            toast.error('❌ Error al guardar. Intente nuevamente.');
        } finally {
            setSaving(false);
        }
    };

    const rolesChanged = selectedRoleIds.length !== (user.roleIds?.length || 0) ||
        !selectedRoleIds.every(id => (user.roleIds || []).includes(id));

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg" scrollable>
            <ModalHeader toggle={toggle}>
                <div className="d-flex align-items-center">
                    <i className="mdi mdi-shield-crown font-size-20 me-2 text-warning"></i>
                    <div>
                        <h5 className="mb-0">Gestionar Roles</h5>
                        <small className="text-muted">{user.fullName}</small>
                    </div>
                </div>
            </ModalHeader>

            <ModalBody>
                <Alert color="info" className="mb-3">
                    <i className="mdi mdi-information me-2"></i>
                    Selecciona los roles que deseas asignar a este usuario. Los permisos de cada rol se heredarán automáticamente.
                </Alert>

                {loadingRoles ? (
                    <div className="text-center py-4">
                        <Spinner color="primary" />
                        <p className="text-muted mt-2">Cargando roles...</p>
                    </div>
                ) : allRoles.length === 0 ? (
                    <div className="text-center py-4">
                        <i className="mdi mdi-shield-off-outline display-4 text-muted"></i>
                        <p className="text-muted mt-2">No hay roles disponibles</p>
                    </div>
                ) : (
                    <div className="roles-list">
                        {allRoles.map(role => {
                            const isSelected = selectedRoleIds.includes(role.id);
                            const permissionCount = role.permissionIds?.length || 0;

                            return (
                                <div
                                    key={role.id}
                                    className={`d-flex align-items-center p-3 border rounded mb-2 ${isSelected ? 'bg-warning bg-opacity-10 border-warning' : ''}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => toggleRole(role.id)}
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
                                            <i className="mdi mdi-shield-crown me-2 text-warning font-size-18"></i>
                                            <span className="fw-medium">{role.name}</span>
                                            {permissionCount > 0 && (
                                                <Badge color="secondary" className="ms-2" pill>
                                                    {permissionCount} permisos
                                                </Badge>
                                            )}
                                        </div>
                                        {role.detail && (
                                            <small className="text-muted d-block mt-1 ms-4">
                                                {role.detail}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {rolesChanged && (
                    <Alert color="warning" className="mt-3 mb-0">
                        <i className="mdi mdi-alert-outline me-2"></i>
                        <strong>Cambios pendientes:</strong>{' '}
                        Roles: {user.roleIds?.length || 0} → {selectedRoleIds.length}
                    </Alert>
                )}
            </ModalBody>

            <ModalFooter>
                <Button color="secondary" onClick={toggle} disabled={saving}>
                    Cancelar
                </Button>
                <Button color="warning" onClick={handleSave} disabled={saving}>
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

export default UserRolesModal;
