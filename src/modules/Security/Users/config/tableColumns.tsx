import React from 'react';
import { Badge } from 'reactstrap';
import { privilegeOptions, languageOptions, statusOptions } from '../data/mockUsers';

export const userTableColumns = [
  {
    key: "name",
    header: "Usuario",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row }) => (
      <div className="d-flex flex-column">
        <div className="d-flex align-items-center">
          {row.original.logo ? (
            <img
              src={row.original.logo}
              alt={`${row.original.name} ${row.original.lastName}`}
              className="avatar-xs rounded-circle me-2"
            />
          ) : (
            <div className="avatar-xs bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
              <span className="text-white font-size-10">
                {row.original.name.charAt(0)}{row.original.lastName.charAt(0)}
              </span>
            </div>
          )}
          <span className="fw-medium">{row.original.name} {row.original.lastName}</span>
        </div>
        <small className="text-muted">{row.original.email}</small>
      </div>
    )
  },
  {
    key: "privilege",
    header: "Privilegio",
    sortable: true,
    filterable: true,
    filterType: "select",
    filterOptions: privilegeOptions,
    cell: ({ row }) => {
      const getPrivilegeBadgeColor = (privilege: string) => {
        switch (privilege) {
          case "admin":
            return "danger";
          case "supervisor":
            return "warning";
          case "user":
            return "info";
          default:
            return "secondary";
        }
      };

      const getPrivilegeLabel = (privilege: string) => {
        switch (privilege) {
          case "admin":
            return "Administrador";
          case "supervisor":
            return "Supervisor";
          case "user":
            return "Usuario";
          default:
            return privilege;
        }
      };

      return (
        <Badge color={getPrivilegeBadgeColor(row.original.privilege)} className="badge-soft-primary">
          {getPrivilegeLabel(row.original.privilege)}
        </Badge>
      );
    }
  },
  {
    key: "roles",
    header: "Roles",
    sortable: false,
    filterable: false,
    cell: ({ row }) => (
      <div className="d-flex flex-wrap gap-1">
        {row.original.roles.length > 0 ?
          row.original.roles.slice(0, 2).map((role, index) => (
            <Badge key={index} color="secondary" className="badge-soft-secondary">
              {role}
            </Badge>
          )) :
          <span className="text-muted">Sin roles</span>
        }
        {row.original.roles.length > 2 && (
          <Badge color="light" className="badge-soft-light">
            +{row.original.roles.length - 2}
          </Badge>
        )}
      </div>
    )
  },
  {
    key: "permissions",
    header: "Permisos",
    sortable: false,
    filterable: false,
    cell: ({ row }) => (
      <div className="d-flex flex-wrap gap-1">
        {row.original.permissions.length > 0 ?
          row.original.permissions.slice(0, 3).map((permission, index) => (
            <Badge key={index} color="info" className="badge-soft-info font-size-10">
              {permission}
            </Badge>
          )) :
          <span className="text-muted">Sin permisos</span>
        }
        {row.original.permissions.length > 3 && (
          <Badge color="light" className="badge-soft-light font-size-10">
            +{row.original.permissions.length - 3}
          </Badge>
        )}
      </div>
    )
  },
  {
    key: "status",
    header: "Estado",
    sortable: true,
    filterable: true,
    filterType: "select",
    filterOptions: statusOptions,
    cell: ({ row }) => (
      <Badge
        color={row.original.status === 'active' ? "success" : "danger"}
        className={`badge-soft-${row.original.status === 'active' ? "success" : "danger"}`}
      >
        {row.original.status === 'active' ? "Activo" : "Inactivo"}
      </Badge>
    )
  },
  {
    key: "phone",
    header: "Teléfono",
    sortable: false,
    filterable: true,
    filterType: "text",
    cell: ({ row }) => (
      <span className="text-muted font-family-monospace">{row.original.phone || 'N/A'}</span>
    )
  },
  {
    key: "language",
    header: "Idioma",
    sortable: true,
    filterable: true,
    filterType: "select",
    filterOptions: languageOptions,
    cell: ({ row }) => {
      const getLanguageFlag = (lang: string) => {
        switch (lang) {
          case "es": return "🇪🇸";
          case "en": return "🇺🇸";
          case "fr": return "🇫🇷";
          case "de": return "🇩🇪";
          default: return "🌐";
        }
      };

      const getLanguageName = (lang: string) => {
        switch (lang) {
          case "es": return "Español";
          case "en": return "English";
          case "fr": return "Français";
          case "de": return "Deutsch";
          default: return lang;
        }
      };

      return (
        <div className="d-flex align-items-center">
          <span className="me-1">{getLanguageFlag(row.original.language)}</span>
          <span>{getLanguageName(row.original.language)}</span>
        </div>
      );
    }
  }
];