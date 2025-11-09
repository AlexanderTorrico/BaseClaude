import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Button, Badge, UncontrolledTooltip } from 'reactstrap';
import { UserModel } from '../models/UserModel';
import UserRolesPermissionsModal from './UserRolesPermissionsModal';

/**
 * Genera las iniciales del nombre completo
 */
const getInitials = (fullName: string): string => {
  const names = fullName.trim().split(' ');
  if (names.length >= 2) {
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  }
  return fullName.charAt(0).toUpperCase();
};

/**
 * Componente Avatar reutilizable
 */
const UserAvatar: React.FC<{ user: UserModel; size?: 'sm' | 'md' | 'lg' }> = ({ user, size = 'md' }) => {
  const sizeClass = size === 'lg' ? 'avatar-lg' : size === 'md' ? 'avatar-md' : 'avatar-sm';

  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.fullName}
        className={`${sizeClass} rounded-circle`}
      />
    );
  }

  return (
    <div className={`${sizeClass} bg-primary rounded-circle d-flex align-items-center justify-content-center`}>
      <span className="text-white font-size-16 fw-bold">
        {getInitials(user.fullName)}
      </span>
    </div>
  );
};

/**
 * Card individual de usuario
 */
const UserCard: React.FC<{
  user: UserModel;
  onEdit: (userId: number) => void;
  onManageRolesPermissions: (userId: number) => void;
}> = ({ user, onEdit, onManageRolesPermissions }) => {
  const roleCount = user.roleIds?.length || 0;
  const directPermissionCount = user.permissionIds?.length || 0;

  // Calcular permisos heredados de roles
  const inheritedPermissionCount = user.roles?.reduce((acc, role) => {
    return acc + (role.permissionIds?.length || 0);
  }, 0) || 0;

  const totalPermissions = directPermissionCount + inheritedPermissionCount;

  return (
    <Card className="border shadow-sm h-100">
      <CardBody>
        {/* Header con Avatar y Nombre */}
        <div className="d-flex flex-column align-items-center text-center mb-3">
          <UserAvatar user={user} size="lg" />
          <h5 className="mt-3 mb-1">{user.fullName}</h5>
          <p className="text-muted mb-0">
            <i className="mdi mdi-email-outline me-1"></i>
            {user.email}
          </p>
        </div>

        {/* Divider */}
        <hr className="my-3" />

        {/* Información del Usuario */}
        <div className="mb-3">
          {/* Teléfono */}
          {user.phone && (
            <div className="d-flex align-items-center mb-2">
              <i className="mdi mdi-phone text-primary me-2 font-size-18"></i>
              <span className="text-muted font-family-monospace">{user.phone}</span>
            </div>
          )}

          {/* Workstation */}
          {user.workStation && (
            <div className="d-flex align-items-center mb-2">
              <i className="mdi mdi-briefcase text-primary me-2 font-size-18"></i>
              <div className="d-flex flex-column">
                <span className="fw-medium">{user.workStation.name || 'N/A'}</span>
                <small className="text-muted">Nivel {user.workStation.level}</small>
              </div>
            </div>
          )}
        </div>

        {/* Roles y Permisos */}
        <div className="d-flex gap-2 mb-3 flex-wrap justify-content-center">
          {/* Badge de Roles */}
          {roleCount > 0 ? (
            <Badge color="primary" pill id={`roles-badge-${user.id}`}>
              <i className="mdi mdi-shield-crown me-1"></i>
              {roleCount} {roleCount === 1 ? 'rol' : 'roles'}
            </Badge>
          ) : (
            <Badge color="light" className="text-muted">
              Sin roles
            </Badge>
          )}

          {/* Badge de Permisos */}
          {totalPermissions > 0 ? (
            <Badge color="info" pill id={`permissions-badge-${user.id}`}>
              <i className="mdi mdi-key-variant me-1"></i>
              {totalPermissions} {totalPermissions === 1 ? 'permiso' : 'permisos'}
            </Badge>
          ) : (
            <Badge color="light" className="text-muted">
              Sin permisos
            </Badge>
          )}

          {/* Tooltips para roles */}
          {roleCount > 0 && user.roles && (
            <UncontrolledTooltip placement="top" target={`roles-badge-${user.id}`}>
              {user.roles.map((role, idx) => (
                <div key={role.id}>
                  {idx + 1}. {role.name}
                </div>
              ))}
            </UncontrolledTooltip>
          )}

          {/* Tooltips para permisos */}
          {totalPermissions > 0 && (
            <UncontrolledTooltip placement="top" target={`permissions-badge-${user.id}`}>
              <div className="text-start">
                {directPermissionCount > 0 && (
                  <div>
                    <strong>Directos:</strong> {directPermissionCount}
                  </div>
                )}
                {inheritedPermissionCount > 0 && (
                  <div>
                    <strong>Heredados:</strong> {inheritedPermissionCount}
                  </div>
                )}
                <div className="mt-1 pt-1 border-top">
                  <strong>Total:</strong> {totalPermissions}
                </div>
              </div>
            </UncontrolledTooltip>
          )}
        </div>

        {/* Divider */}
        <hr className="my-3" />

        {/* Acciones - Solo Editar según especificación */}
        <div className="d-flex gap-2 justify-content-center">
          <Button
            color="success"
            size="sm"
            onClick={() => onManageRolesPermissions(user.id)}
            title="Gestionar roles y permisos"
          >
            <i className="mdi mdi-shield-account me-1"></i>
            Roles/Permisos
          </Button>

          <Button
            color="primary"
            size="sm"
            onClick={() => onEdit(user.id)}
            title="Editar usuario"
          >
            <i className="mdi mdi-pencil me-1"></i>
            Editar
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

/**
 * Vista de Cards para usuarios
 * Muestra los usuarios en formato de tarjetas (cards)
 */
interface ContentCardsProps {
  filteredUsers: UserModel[];
  onRefresh: (companyId: number) => Promise<void>;
}

const ContentCards: React.FC<ContentCardsProps> = ({ filteredUsers, onRefresh }) => {
  const [isRolesPermissionsModalOpen, setIsRolesPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

  const handleManageRolesPermissions = (userId: number) => {
    const user = filteredUsers.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsRolesPermissionsModalOpen(true);
    }
  };

  const handleRolesPermissionsUpdated = () => {
    setIsRolesPermissionsModalOpen(false);
    setSelectedUser(null);
    onRefresh(1);
  };

  const handleEditUser = (userId: number) => {
    console.log('Editar usuario:', userId);
  };

  return (
    <>
      {/* Grid de Cards */}
      <Row>
        {filteredUsers.map(user => (
          <Col key={user.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
            <UserCard
              user={user}
              onEdit={handleEditUser}
              onManageRolesPermissions={handleManageRolesPermissions}
            />
          </Col>
        ))}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <Col xs={12}>
            <div className="text-center py-5">
              <i className="mdi mdi-account-off-outline display-4 text-muted"></i>
              <h5 className="mt-3">No se encontraron usuarios</h5>
              <p className="text-muted">
                Intenta ajustar los filtros o busca con otros criterios
              </p>
            </div>
          </Col>
        )}
      </Row>

      {/* Modal para gestionar roles y permisos */}
      {selectedUser && (
        <UserRolesPermissionsModal
          isOpen={isRolesPermissionsModalOpen}
          toggle={() => setIsRolesPermissionsModalOpen(false)}
          user={selectedUser}
          onSuccess={handleRolesPermissionsUpdated}
        />
      )}
    </>
  );
};

export default ContentCards;
