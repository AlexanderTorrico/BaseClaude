import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Row,
    Col,
    Badge,
    Card,
    CardBody,
    Spinner,
} from 'reactstrap';
import { UserModel } from '../../models/UserModel';
import { PermissionModel } from '../../../Permissions/models/PermissionModel';
import { PermissionApiService } from '../../../Permissions/services/PermissionApiService';
import { RoleModel } from '../../../Roles/models/RoleModel';
import UserAvatar from '@/components/Common/UserAvatar';

interface UserDetailsModalProps {
    isOpen: boolean;
    toggle: () => void;
    user: UserModel;
}

const permissionService = new PermissionApiService();

/**
 * Modal para ver los detalles completos de un usuario
 * Incluye información personal, roles y permisos
 */
const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
    isOpen,
    toggle,
    user,
}) => {
    const [permissions, setPermissions] = useState<PermissionModel[]>([]);
    const [loadingPermissions, setLoadingPermissions] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            fetchUserPermissions();
        }
    }, [isOpen, user]);

    const fetchUserPermissions = async () => {
        setLoadingPermissions(true);
        try {
            const result = await permissionService.getUserPermissions(user.id);
            if (result.data) {
                setPermissions(result.data);
            }
        } catch (error) {
            console.error('Error fetching user permissions:', error);
        } finally {
            setLoadingPermissions(false);
        }
    };

    // Agrupar permisos por módulo
    const groupedPermissions = permissions.reduce((acc, perm) => {
        const moduleName = perm.module?.name || 'Sin Módulo';
        if (!acc[moduleName]) {
            acc[moduleName] = [];
        }
        acc[moduleName].push(perm);
        return acc;
    }, {} as Record<string, PermissionModel[]>);

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg" scrollable>
            <ModalHeader toggle={toggle}>
                <div className="d-flex align-items-center">
                    <i className="mdi mdi-account-details font-size-20 me-2 text-info"></i>
                    <div>
                        <h5 className="mb-0">Detalles del Usuario</h5>
                        <small className="text-muted">{user.fullName}</small>
                    </div>
                </div>
            </ModalHeader>

            <ModalBody>
                {/* Información Personal */}
                <Card className="mb-3">
                    <CardBody>
                        <h6 className="text-primary mb-3">
                            <i className="mdi mdi-account me-2"></i>
                            Información Personal
                        </h6>
                        <Row>
                            <Col md={3} className="text-center mb-3">
                                <UserAvatar
                                    fullName={user.fullName}
                                    avatar={user.avatar}
                                    size="lg"
                                />
                            </Col>
                            <Col md={9}>
                                <Row>
                                    <Col md={6} className="mb-2">
                                        <strong>Nombre Completo:</strong>
                                        <div className="text-muted">{user.fullName}</div>
                                    </Col>
                                    <Col md={6} className="mb-2">
                                        <strong>Email:</strong>
                                        <div className="text-muted">{user.email}</div>
                                    </Col>
                                    <Col md={6} className="mb-2">
                                        <strong>Teléfono:</strong>
                                        <div className="text-muted">{user.phone || 'No registrado'}</div>
                                    </Col>
                                    <Col md={6} className="mb-2">
                                        <strong>Puesto de Trabajo:</strong>
                                        <div className="text-muted">{user.workStation?.name || 'Sin asignar'}</div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                {/* Roles */}
                <Card className="mb-3">
                    <CardBody>
                        <h6 className="text-primary mb-3">
                            <i className="mdi mdi-shield-crown me-2"></i>
                            Roles Asignados
                            <Badge color="secondary" className="ms-2">
                                {user.roles?.length || 0}
                            </Badge>
                        </h6>
                        {(!user.roles || user.roles.length === 0) ? (
                            <div className="text-center text-muted py-3">
                                <i className="mdi mdi-shield-off-outline font-size-24 d-block mb-2"></i>
                                No tiene roles asignados
                            </div>
                        ) : (
                            <div className="d-flex flex-wrap gap-2">
                                {user.roles.map((role: RoleModel) => (
                                    <Badge key={role.id} color="primary" pill className="py-2 px-3">
                                        <i className="mdi mdi-shield-crown me-1"></i>
                                        {role.name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Permisos Directos */}
                <Card>
                    <CardBody>
                        <h6 className="text-primary mb-3">
                            <i className="mdi mdi-key-variant me-2"></i>
                            Permisos Directos
                            <Badge color="info" className="ms-2">
                                {permissions.length}
                            </Badge>
                        </h6>

                        {loadingPermissions ? (
                            <div className="text-center py-4">
                                <Spinner color="primary" size="sm" />
                                <span className="ms-2 text-muted">Cargando permisos...</span>
                            </div>
                        ) : permissions.length === 0 ? (
                            <div className="text-center text-muted py-3">
                                <i className="mdi mdi-key-off-outline font-size-24 d-block mb-2"></i>
                                No tiene permisos directos asignados
                            </div>
                        ) : (
                            <div>
                                {Object.entries(groupedPermissions).map(([moduleName, modulePermissions]) => (
                                    <div key={moduleName} className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="mdi mdi-folder text-primary me-2"></i>
                                            <strong>{moduleName}</strong>
                                            <Badge color="light" className="ms-2 text-muted">
                                                {modulePermissions.length}
                                            </Badge>
                                        </div>
                                        <div className="ms-4">
                                            {modulePermissions.map((perm: PermissionModel) => (
                                                <div key={perm.id} className="d-flex align-items-start mb-2 p-2 bg-light rounded">
                                                    <i className="mdi mdi-key-variant text-info me-2 mt-1"></i>
                                                    <div>
                                                        <div className="fw-medium">
                                                            {perm.namePublic || perm.name}
                                                        </div>
                                                        {perm.description && (
                                                            <small className="text-muted">{perm.description}</small>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardBody>
                </Card>
            </ModalBody>

            <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                    <i className="mdi mdi-close me-1"></i>
                    Cerrar
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default UserDetailsModal;
