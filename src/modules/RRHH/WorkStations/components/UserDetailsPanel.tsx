import React from 'react';
import { Card, CardBody, Badge } from 'reactstrap';
import { UserOrgNode } from '@/modules/RRHH/shared/hooks/useSharedUsers';
import UserAvatar from '@/components/Common/UserAvatar';

interface UserDetailsPanelProps {
  user: UserOrgNode | null;
}

const UserDetailsPanel: React.FC<UserDetailsPanelProps> = ({ user }) => {
  if (!user) {
    return (
      <Card className="h-100">
        <CardBody className="d-flex flex-column align-items-center justify-content-center text-center py-5">
          <i className="mdi mdi-account-search-outline text-muted" style={{ fontSize: '64px' }}></i>
          <h5 className="mt-3 text-muted">Selecciona un usuario</h5>
          <p className="text-muted mb-0">
            Haz clic en un usuario del organigrama para ver sus detalles
          </p>
        </CardBody>
      </Card>
    );
  }

  const getLevelColor = (level: number = 0) => {
    const colors = ['primary', 'success', 'warning', 'info', 'danger'];
    return colors[level % colors.length];
  };

  return (
    <Card className="h-100">
      <CardBody>
        {/* Header con Avatar al lado */}
        <div className="d-flex align-items-center border-bottom pb-4 mb-4">
          <UserAvatar
            fullName={user.fullName}
            avatar={user.avatar}
            size="lg"
          />
          <div className="ms-3">
            <h5 className="mb-1">{user.fullName}</h5>
            <p className="text-muted mb-1">{user.email}</p>
            {user.workStation && (
              <Badge color={getLevelColor(user.workStation.level)} pill className="px-3 py-1">
                <i className="mdi mdi-briefcase me-1"></i>
                {user.workStation.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Información del Puesto */}
        {user.workStation && (
          <div className="mb-4">
            <h6 className="text-uppercase text-muted mb-3">
              <i className="mdi mdi-briefcase-outline me-2"></i>
              Información del Puesto
            </h6>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Nivel Jerárquico:</span>
              <Badge color={getLevelColor(user.workStation.level)}>
                Nivel {user.workStation.level}
              </Badge>
            </div>

            {user.workStation.description && (
              <div className="mb-3">
                <span className="text-muted d-block mb-1">Descripción:</span>
                <p className="mb-0 bg-light p-2 rounded">
                  {user.workStation.description}
                </p>
              </div>
            )}

            {user.workStation.requirements && (
              <div className="mb-3">
                <span className="text-muted d-block mb-1">Requisitos:</span>
                <p className="mb-0 bg-light p-2 rounded">
                  {user.workStation.requirements}
                </p>
              </div>
            )}

            {user.workStation.responsabilities && (
              <div className="mb-3">
                <span className="text-muted d-block mb-1">Responsabilidades:</span>
                <p className="mb-0 bg-light p-2 rounded">
                  {user.workStation.responsabilities}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Información de Contacto */}
        <div className="mb-4">
          <h6 className="text-uppercase text-muted mb-3">
            <i className="mdi mdi-card-account-details-outline me-2"></i>
            Información de Contacto
          </h6>

          {user.phone && (
            <div className="d-flex align-items-center mb-2">
              <i className="mdi mdi-phone text-muted me-2"></i>
              <span>{user.phone}</span>
            </div>
          )}

          <div className="d-flex align-items-center mb-2">
            <i className="mdi mdi-email text-muted me-2"></i>
            <span>{user.email}</span>
          </div>
        </div>

        {/* Subordinados */}
        {user.children && user.children.length > 0 && (
          <div>
            <h6 className="text-uppercase text-muted mb-3">
              <i className="mdi mdi-account-group me-2"></i>
              Subordinados ({user.children.length})
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {user.children.map(child => (
                <Badge key={child.id} color="light" className="text-dark border">
                  <i className="mdi mdi-account me-1"></i>
                  {child.fullName}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default UserDetailsPanel;
