import React from 'react';
import { UserModel } from '../models/UserModel';

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
    cell: ({ row }: { row: { original: UserModel } }) => (
      <div className="d-flex flex-column">
        <div className="d-flex align-items-center">
          <UserAvatar user={row.original} />
          <span className="fw-medium">{row.original.fullName}</span>
        </div>
        <small className="text-muted">{row.original.email}</small>
      </div>
    )
  },
  {
    key: "name",
    header: "Nombre",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row }: { row: { original: UserModel } }) => (
      <span>{row.original.name}</span>
    )
  },
  {
    key: "lastName",
    header: "Apellido",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row }: { row: { original: UserModel } }) => (
      <span>{row.original.lastName}</span>
    )
  },
  {
    key: "email",
    header: "Correo Electrónico",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row }: { row: { original: UserModel } }) => (
      <span className="text-muted">{row.original.email}</span>
    )
  },
  {
    key: "phone",
    header: "Teléfono",
    sortable: false,
    filterable: true,
    filterType: "text",
    cell: ({ row }: { row: { original: UserModel } }) => (
      <span className="text-muted font-family-monospace">
        {row.original.phone || <span className="text-muted">N/A</span>}
      </span>
    )
  }
];
