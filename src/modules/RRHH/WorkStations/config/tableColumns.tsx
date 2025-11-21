import React from 'react';
import { Badge } from 'reactstrap';
import { WorkStationModel } from '@/modules/RRHH/shared/models/WorkStationModel';
import { getLevelColor } from '../utils/levelHelpers';

/**
 * Configuración de columnas para la vista de tabla de Work Stations
 */

export const workStationTableColumns = [
  {
    key: "name",
    header: "Puesto de Trabajo",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row }: { row: { original: WorkStationModel } }) => {
      const ws = row.original;
      const levelConfig = getLevelColor(ws.level);

      return (
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              width: '4px',
              height: '32px',
              backgroundColor: levelConfig.bg,
              borderRadius: '2px'
            }}
          ></div>
          <div>
            <div className="fw-medium">{ws.name}</div>
            <small className="text-muted">{levelConfig.name}</small>
          </div>
        </div>
      );
    }
  },
  {
    key: "level",
    header: "Nivel",
    sortable: true,
    filterable: true,
    filterType: "select",
    filterOptions: ['0', '1', '2', '3', '4', '5'],
    cell: ({ row }: { row: { original: WorkStationModel } }) => {
      const ws = row.original;
      const levelConfig = getLevelColor(ws.level);

      return (
        <Badge
          style={{
            backgroundColor: levelConfig.bg,
            color: levelConfig.text
          }}
          pill
        >
          Nivel {ws.level}
        </Badge>
      );
    }
  },
  {
    key: "dependencyName",
    header: "Depende de",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row }: { row: { original: WorkStationModel } }) => {
      const ws = row.original;

      if (ws.dependencyId === 0) {
        return (
          <Badge color="secondary">
            <i className="mdi mdi-star me-1"></i>
            Raíz
          </Badge>
        );
      }

      return (
        <span className="text-muted">
          {ws.dependencyName || `ID ${ws.dependencyId}`}
        </span>
      );
    }
  },
  {
    key: "employeeCount",
    header: "Empleados",
    sortable: true,
    filterable: false,
    cell: ({ row }: { row: { original: WorkStationModel } }) => {
      const count = row.original.employeeCount || 0;

      return (
        <div className="d-flex align-items-center gap-1">
          <i className="mdi mdi-account-group text-primary"></i>
          <span>{count}</span>
        </div>
      );
    }
  },
  {
    key: "requirementCount",
    header: "Requisitos",
    sortable: true,
    filterable: false,
    cell: ({ row }: { row: { original: WorkStationModel } }) => {
      const count = row.original.requirementCount || 0;

      return (
        <div className="d-flex align-items-center gap-1">
          <i className="mdi mdi-clipboard-list text-info"></i>
          <span>{count}</span>
        </div>
      );
    }
  }
];
