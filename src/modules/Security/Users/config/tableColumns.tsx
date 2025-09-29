import React from 'react';
import { Badge } from 'reactstrap';
import { rolesOptions, departamentosOptions, estadoOptions } from '../data/mockUsers';

export const userTableColumns = [
  {
    key: "nombre",
    header: "Nombre",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row }) => (
      <div className="d-flex flex-column">
        <span className="fw-medium">{row.original.nombre}</span>
        <small className="text-muted">{row.original.email}</small>
      </div>
    )
  },
  {
    key: "rol",
    header: "Rol",
    sortable: true,
    filterable: true,
    filterType: "select",
    filterOptions: rolesOptions,
    cell: ({ row }) => {
      const getRoleBadgeColor = (rol: string) => {
        switch (rol) {
          case "Administrador":
            return "danger";
          case "Supervisor":
            return "warning";
          case "Usuario":
            return "info";
          default:
            return "secondary";
        }
      };

      return (
        <Badge color={getRoleBadgeColor(row.original.rol)} className="badge-soft-primary">
          {row.original.rol}
        </Badge>
      );
    }
  },
  {
    key: "departamento",
    header: "Departamento",
    sortable: true,
    filterable: true,
    filterType: "select",
    filterOptions: departamentosOptions,
    cell: ({ row }) => (
      <span className="text-muted">{row.original.departamento}</span>
    )
  },
  {
    key: "estado",
    header: "Estado",
    sortable: true,
    filterable: true,
    filterType: "select",
    filterOptions: estadoOptions,
    cell: ({ row }) => (
      <Badge
        color={row.original.estado ? "success" : "danger"}
        className={`badge-soft-${row.original.estado ? "success" : "danger"}`}
      >
        {row.original.estado ? "Activo" : "Inactivo"}
      </Badge>
    )
  },
  {
    key: "telefono",
    header: "Teléfono",
    sortable: false,
    filterable: true,
    filterType: "text",
    cell: ({ row }) => (
      <span className="text-muted font-family-monospace">{row.original.telefono}</span>
    )
  },
  {
    key: "fechaCreacion",
    header: "Fecha Creación",
    sortable: true,
    filterable: false,
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaCreacion);
      return (
        <div className="d-flex flex-column">
          <span>{fecha.toLocaleDateString('es-ES')}</span>
          <small className="text-muted">Hace {Math.floor((Date.now() - fecha.getTime()) / (1000 * 60 * 60 * 24))} días</small>
        </div>
      );
    }
  },
  {
    key: "ultimoAcceso",
    header: "Último Acceso",
    sortable: true,
    filterable: false,
    cell: ({ row }) => {
      const fecha = new Date(row.original.ultimoAcceso);
      const diasDesdeAcceso = Math.floor((Date.now() - fecha.getTime()) / (1000 * 60 * 60 * 24));

      return (
        <div className="d-flex flex-column">
          <span>{fecha.toLocaleDateString('es-ES')}</span>
          <small className={`${diasDesdeAcceso > 7 ? 'text-warning' : diasDesdeAcceso > 30 ? 'text-danger' : 'text-muted'}`}>
            Hace {diasDesdeAcceso} días
          </small>
        </div>
      );
    }
  }
];