import React from 'react';
import { RoleModel } from '../models/RoleModel';
import { Badge } from 'reactstrap';

/**
 * Configuración de columnas para AzTable del módulo Roles
 */
export const roleTableColumns = [
  {
    key: 'name',
    header: 'Rol',
    sortable: true,
    filterable: true,
    filterType: 'text',
    cell: ({ row }: { row: { original: RoleModel } }) => {
      const role = row.original;
      return (
        <div className="d-flex align-items-center">
          <div
            className="avatar-xs bg-soft-primary rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{ width: '32px', height: '32px' }}
          >
            <i className="mdi mdi-shield-account font-size-16 text-primary"></i>
          </div>
          <div>
            <div className="fw-semibold">{role.name}</div>
            <small className="text-muted">ID: {role.id}</small>
          </div>
        </div>
      );
    },
  },
  {
    key: 'description',
    header: 'Descripción',
    sortable: false,
    filterable: true,
    filterType: 'text',
    cell: ({ row }: { row: { original: RoleModel } }) => {
      const role = row.original;
      return (
        <div className="text-muted">
          {role.description.length > 60
            ? `${role.description.substring(0, 60)}...`
            : role.description}
        </div>
      );
    },
  },
  {
    key: 'permissionIds',
    header: 'Permisos',
    sortable: true,
    filterable: false,
    cell: ({ row }: { row: { original: RoleModel } }) => {
      const role = row.original;
      const permissionCount = role.permissionIds.length;

      let badgeColor = 'primary';
      if (permissionCount === 0) badgeColor = 'secondary';
      else if (permissionCount < 5) badgeColor = 'info';
      else if (permissionCount < 10) badgeColor = 'primary';
      else badgeColor = 'success';

      return (
        <div className="d-flex align-items-center gap-1">
          <Badge color={badgeColor} pill className="d-flex align-items-center gap-1">
            <i className="mdi mdi-key font-size-10"></i>
            <span>{permissionCount}</span>
          </Badge>
          {permissionCount > 0 && (
            <small className="text-muted">permisos</small>
          )}
        </div>
      );
    },
  },
  {
    key: 'userCount',
    header: 'Usuarios',
    sortable: true,
    filterable: false,
    cell: ({ row }: { row: { original: RoleModel } }) => {
      const role = row.original;
      const userCount = role.userCount;

      let badgeColor = 'secondary';
      if (userCount === 0) badgeColor = 'secondary';
      else if (userCount < 5) badgeColor = 'info';
      else if (userCount < 20) badgeColor = 'primary';
      else badgeColor = 'warning';

      return (
        <div className="d-flex align-items-center gap-1">
          <Badge color={badgeColor} pill className="d-flex align-items-center gap-1">
            <i className="mdi mdi-account-group font-size-10"></i>
            <span>{userCount}</span>
          </Badge>
          {userCount > 0 && (
            <small className="text-muted">usuarios</small>
          )}
        </div>
      );
    },
  },
  {
    key: 'isActive',
    header: 'Estado',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: ['Activo', 'Inactivo'],
    cell: ({ row }: { row: { original: RoleModel } }) => {
      const role = row.original;
      return (
        <Badge
          color={role.isActive ? 'success' : 'danger'}
          className="badge-soft-pill d-inline-flex align-items-center gap-1"
        >
          <i
            className={`mdi mdi-${role.isActive ? 'check-circle' : 'close-circle'} font-size-12`}
          ></i>
          <span>{role.isActive ? 'Activo' : 'Inactivo'}</span>
        </Badge>
      );
    },
  },
  {
    key: 'createdAt',
    header: 'Fecha de Creación',
    sortable: true,
    filterable: false,
    cell: ({ row }: { row: { original: RoleModel } }) => {
      const role = row.original;
      const date = new Date(role.createdAt);
      return (
        <div className="text-muted">
          <div>{date.toLocaleDateString('es-ES')}</div>
          <small>{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</small>
        </div>
      );
    },
  },
];
