import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Button, Badge, UncontrolledTooltip } from 'reactstrap';
import { UserModel } from '../models/UserModel';
import UserPermissionsModal from './UserPermissionsModal';
import UserRolesModal from './UserRolesModal';
import UserAvatar from '../../../../components/Common/UserAvatar';

/**
 * Genera un ID seguro para usar en HTML (remueve caracteres especiales)
 */
const safeId = (uuid: string): string => uuid.replace(/[^a-zA-Z0-9]/g, '');

/**
 * Card individual de usuario
 */
const UserCard: React.FC<{
  user: UserModel;
  onEdit: (userUuid: string) => void;
  onManageRoles: (userUuid: string) => void;
  onManagePermissions: (userUuid: string) => void;
}> = ({ user, onEdit, onManageRoles, onManagePermissions }) => {
  const roleCount = user.roleIds?.length || 0;
  const directPermissionCount = user.permissionIds?.length || 0;

  const inheritedPermissionCount = user.roles?.reduce((acc, role) => {
    return acc + (role.permissionIds?.length || 0);
  }, 0) || 0;

  const totalPermissions = directPermissionCount + inheritedPermissionCount;

  return (
    <Card className="border shadow-sm h-100">
      <CardBody>
        <div className="d-flex flex-column align-items-center text-center mb-3">
          <UserAvatar fullName={user.fullName} avatar={user.avatar ?? undefined} size="lg" />
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
            <Badge color="primary" pill id={`roles-badge-${safeId(user.uuid)}`}>
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
            <Badge color="info" pill id={`permissions-badge-${safeId(user.uuid)}`}>
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
            <UncontrolledTooltip placement="top" target={`roles-badge-${safeId(user.uuid)}`} fade={false}>
              {user.roles.map((role, idx) => (
                <div key={role.id}>
                  {idx + 1}. {role.name}
                </div>
              ))}
            </UncontrolledTooltip>
          )}

          {/* Tooltips para permisos */}
          {totalPermissions > 0 && (
            <UncontrolledTooltip placement="top" target={`permissions-badge-${safeId(user.uuid)}`} fade={false}>
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

        {/* Acciones */}
        <div className="d-flex gap-2 justify-content-center flex-wrap">
          <Button
            color="warning"
            size="sm"
            onClick={() => onManageRoles(user.uuid)}
            title="Gestionar roles"
          >
            <i className="mdi mdi-shield-crown me-1"></i>
            Roles
          </Button>

          <Button
            color="success"
            size="sm"
            onClick={() => onManagePermissions(user.uuid)}
            title="Gestionar permisos"
          >
            <i className="mdi mdi-key-variant me-1"></i>
            Permisos
          </Button>

          <Button
            color="primary"
            size="sm"
            onClick={() => onEdit(user.uuid)}
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
  onEdit: (userUuid: string) => void;
}

const ContentCards: React.FC<ContentCardsProps> = ({ filteredUsers, onRefresh, onEdit }) => {
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

  const handleManageRoles = (userUuid: string) => {
    const user = filteredUsers.find(u => u.uuid === userUuid);
    if (user) {
      setSelectedUser(user);
      setIsRolesModalOpen(true);
    }
  };

  const handleManagePermissions = (userUuid: string) => {
    const user = filteredUsers.find(u => u.uuid === userUuid);
    if (user) {
      setSelectedUser(user);
      setIsPermissionsModalOpen(true);
    }
  };

  const handlePermissionsUpdated = () => {
    setIsPermissionsModalOpen(false);
    setSelectedUser(null);
    onRefresh(1);
  };

  const handleRolesUpdated = () => {
    setIsRolesModalOpen(false);
    setSelectedUser(null);
    onRefresh(1);
  };

  return (
    <>
      {/* Grid de Cards */}
      <Row>
        {filteredUsers.map(user => (
          <Col key={user.uuid} xs={12} sm={6} lg={4} xl={3} className="mb-4">
            <UserCard
              user={user}
              onEdit={onEdit}
              onManageRoles={handleManageRoles}
              onManagePermissions={handleManagePermissions}
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

      {/* Modal para gestionar permisos */}
      {selectedUser && (
        <UserPermissionsModal
          isOpen={isPermissionsModalOpen}
          toggle={() => setIsPermissionsModalOpen(false)}
          user={selectedUser}
          onSuccess={handlePermissionsUpdated}
        />
      )}

      {/* Modal para gestionar roles */}
      {selectedUser && (
        <UserRolesModal
          isOpen={isRolesModalOpen}
          toggle={() => setIsRolesModalOpen(false)}
          user={selectedUser}
          onSuccess={handleRolesUpdated}
        />
      )}
    </>
  );
};

export default ContentCards;
