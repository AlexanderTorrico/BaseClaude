import React from 'react';
import { Badge, UncontrolledTooltip } from 'reactstrap';
import { UserModel } from '../models/UserModel';

/**
 * Genera las iniciales del nombre completo
 */
const getInitials = (fullName?: string): string => {
  if (!fullName || fullName.trim() === '') {
    return '??';
  }
  const names = fullName.trim().split(' ');
  if (names.length >= 2) {
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  }
  return fullName.charAt(0).toUpperCase();
};

/**
 * Componente Avatar con iniciales si no hay imagen
 */
const UserAvatar: React.FC<{ user: UserModel }> = ({ user }) => {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.fullName}
        className="avatar-xs rounded-circle me-2"
      />
    );
  }

  return (
    <div className="avatar-xs bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
      <span className="text-white font-size-10 fw-bold">
        {getInitials(user.fullName)}
      </span>
    </div>
  );
};

export const userTableColumns = [
  {
    key: "fullName",
    header: "Usuario",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row: { original } }: { row: { original: UserModel } }) => (
      <div className="d-flex flex-column">
        <div className="d-flex align-items-center">
          <UserAvatar user={original} />
          <span className="fw-medium">{original.fullName || `${original.name} ${original.lastName}`}</span>
        </div>
        <small className="text-muted">{original.email}</small>
      </div>
    )
  },
  {
    key: "name",
    header: "Nombre",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row: { original } }: { row: { original: UserModel } }) => original.name
  },
  {
    key: "lastName",
    header: "Apellido",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row: { original } }: { row: { original: UserModel } }) => original.lastName
  },
  {
    key: "email",
    header: "Correo Electrónico",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row: { original } }: { row: { original: UserModel } }) => (
      <span className="text-muted">{original.email}</span>
    )
  },
  {
    key: "phone",
    header: "Teléfono",
    sortable: false,
    filterable: true,
    filterType: "text",
    cell: ({ row: { original } }: { row: { original: UserModel } }) => (
      <span className="text-muted font-family-monospace">
        {original.phone || <span className="text-muted">N/A</span>}
      </span>
    )
  },
  {
    key: "roles",
    header: "Roles",
    sortable: false,
    filterable: false,
    cell: ({ row: { original } }: { row: { original: UserModel } }) => {
      const roleCount = original.roleIds?.length || 0;

      if (roleCount === 0) {
        return (
          <Badge color="light" className="text-muted">
            Sin roles
          </Badge>
        );
      }

      const firstRole = original.roles?.[0];
      const tooltipId = `roles-tooltip-${original.id}`;

      return (
        <div className="d-flex align-items-center gap-1">
          <Badge color="primary" pill id={tooltipId}>
            <i className="mdi mdi-shield-crown me-1"></i>
            {roleCount} {roleCount === 1 ? 'rol' : 'roles'}
          </Badge>
          {firstRole && (
            <UncontrolledTooltip placement="top" target={tooltipId}>
              {original.roles?.map((role, idx) => (
                <div key={role.id}>
                  {idx + 1}. {role.name}
                </div>
              ))}
            </UncontrolledTooltip>
          )}
        </div>
      );
    }
  },
  {
    key: "permissions",
    header: "Permisos",
    sortable: false,
    filterable: false,
    cell: ({ row: { original } }: { row: { original: UserModel } }) => {
      const directPermissionCount = original.permissionIds?.length || 0;

      // Calcular permisos heredados de roles
      const inheritedPermissionCount = original.roles?.reduce((acc, role) => {
        return acc + (role.permissionIds?.length || 0);
      }, 0) || 0;

      const totalPermissions = directPermissionCount + inheritedPermissionCount;
      const tooltipId = `permissions-tooltip-${original.id}`;

      if (totalPermissions === 0) {
        return (
          <Badge color="light" className="text-muted">
            Sin permisos
          </Badge>
        );
      }

      return (
        <div className="d-flex align-items-center gap-1">
          <Badge color="info" pill id={tooltipId}>
            <i className="mdi mdi-key-variant me-1"></i>
            {totalPermissions} {totalPermissions === 1 ? 'permiso' : 'permisos'}
          </Badge>
          <UncontrolledTooltip placement="top" target={tooltipId}>
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
        </div>
      );
    }
  }
];
