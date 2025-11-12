import React from 'react';
import { Branch } from '../models/CompanyModel';
import { Badge } from 'reactstrap';

/**
 * Configuración de columnas para AzTable del módulo de Sucursales
 */
export const branchTableColumns = [
  {
    key: 'name',
    header: 'Sucursal',
    sortable: true,
    filterable: true,
    filterType: 'text',
    cell: ({ row }: { row: { original: Branch } }) => {
      const branch = row.original;
      return (
        <div className="d-flex align-items-center">
          <div
            className="avatar-xs bg-soft-warning rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{ width: '32px', height: '32px' }}
          >
            <i className="mdi mdi-store font-size-16 text-warning"></i>
          </div>
          <div>
            <div className="fw-semibold">{branch.name}</div>
            <small className="text-muted">ID: {branch.id}</small>
          </div>
        </div>
      );
    },
  },
  {
    key: 'address',
    header: 'Dirección',
    sortable: true,
    filterable: true,
    filterType: 'text',
    cell: ({ row }: { row: { original: Branch } }) => {
      const branch = row.original;
      return (
        <div className="d-flex align-items-start">
          <i className="mdi mdi-map-marker font-size-16 text-muted me-2"></i>
          <div>
            <div>{branch.address}</div>
            {(branch.lat && branch.lng) && (
              <small className="text-muted">
                Lat: {branch.lat.toFixed(4)}, Lng: {branch.lng.toFixed(4)}
              </small>
            )}
          </div>
        </div>
      );
    },
  },
  {
    key: 'phone',
    header: 'Teléfono',
    sortable: false,
    filterable: true,
    filterType: 'text',
    cell: ({ row }: { row: { original: Branch } }) => {
      const branch = row.original;
      return (
        <div className="d-flex align-items-center">
          <i className="mdi mdi-phone font-size-16 text-muted me-2"></i>
          <span>{branch.phone}</span>
        </div>
      );
    },
  },
  {
    key: 'email',
    header: 'Email',
    sortable: false,
    filterable: true,
    filterType: 'text',
    cell: ({ row }: { row: { original: Branch } }) => {
      const branch = row.original;
      return branch.email ? (
        <div className="d-flex align-items-center">
          <i className="mdi mdi-email font-size-16 text-muted me-2"></i>
          <span className="text-break">{branch.email}</span>
        </div>
      ) : (
        <span className="text-muted">—</span>
      );
    },
  },
  {
    key: 'schedules',
    header: 'Horarios',
    sortable: false,
    filterable: false,
    cell: ({ row }: { row: { original: Branch } }) => {
      const branch = row.original;
      return branch.schedules ? (
        <div className="text-muted small">
          {branch.schedules.length > 40
            ? `${branch.schedules.substring(0, 40)}...`
            : branch.schedules}
        </div>
      ) : (
        <span className="text-muted">—</span>
      );
    },
  },
  {
    key: 'active',
    header: 'Estado',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: ['Activo', 'Inactivo'],
    cell: ({ row }: { row: { original: Branch } }) => {
      const branch = row.original;
      return (
        <Badge
          color={branch.active ? 'success' : 'danger'}
          className="badge-soft-pill d-inline-flex align-items-center gap-1"
        >
          <i
            className={`mdi mdi-${branch.active ? 'check-circle' : 'close-circle'} font-size-12`}
          ></i>
          <span>{branch.active ? 'Activo' : 'Inactivo'}</span>
        </Badge>
      );
    },
  },
  {
    key: 'createdAt',
    header: 'Fecha de Creación',
    sortable: true,
    filterable: false,
    cell: ({ row }: { row: { original: Branch } }) => {
      const branch = row.original;
      const date = new Date(branch.createdAt);
      return (
        <div className="text-muted">
          <div>{date.toLocaleDateString('es-ES')}</div>
          <small>{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</small>
        </div>
      );
    },
  },
];
