import React from 'react';
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { WorkStationModel } from '@/modules/RRHH/shared/models/WorkStationModel';
import { getLevelColor } from '../utils/levelHelpers';

/**
 * Nodo individual para el árbol organizacional
 * Muestra información del puesto con diseño atractivo
 */

interface WorkStationNodeProps {
  workStation: WorkStationModel;
  onViewRequirements?: (workStation: WorkStationModel) => void;
  onEdit?: (workStation: WorkStationModel) => void;
  onDelete?: (workStation: WorkStationModel) => void;
}

const WorkStationNode: React.FC<WorkStationNodeProps> = ({
  workStation,
  onViewRequirements,
  onEdit,
  onDelete
}) => {
  const levelConfig = getLevelColor(workStation.level);

  return (
    <div
      className="workstation-node"
      style={{
        background: '#ffffff',
        border: `2px solid ${levelConfig.bg}`,
        borderRadius: '8px',
        padding: '12px 16px',
        minWidth: '200px',
        maxWidth: '250px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Indicador de nivel (barra lateral) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          backgroundColor: levelConfig.bg,
          borderTopLeftRadius: '6px',
          borderBottomLeftRadius: '6px'
        }}
      ></div>

      {/* Header con nivel */}
      <div className="d-flex justify-content-between align-items-start mb-2">
        <Badge
          style={{
            backgroundColor: levelConfig.bg,
            color: levelConfig.text
          }}
          pill
        >
          Nivel {workStation.level}
        </Badge>

        {/* Menú de acciones */}
        <UncontrolledDropdown>
          <DropdownToggle
            tag="button"
            className="btn btn-sm btn-link text-muted p-0"
            style={{ fontSize: '18px' }}
          >
            <i className="mdi mdi-dots-vertical"></i>
          </DropdownToggle>
          <DropdownMenu end>
            {onViewRequirements && (
              <DropdownItem onClick={() => onViewRequirements(workStation)}>
                <i className="mdi mdi-clipboard-list text-info me-2"></i>
                Ver Requisitos
              </DropdownItem>
            )}
            {onEdit && (
              <DropdownItem onClick={() => onEdit(workStation)}>
                <i className="mdi mdi-pencil text-warning me-2"></i>
                Editar
              </DropdownItem>
            )}
            {onDelete && (
              <>
                <DropdownItem divider />
                <DropdownItem onClick={() => onDelete(workStation)}>
                  <i className="mdi mdi-delete text-danger me-2"></i>
                  Eliminar
                </DropdownItem>
              </>
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>

      {/* Nombre del puesto */}
      <div className="fw-bold mb-2" style={{ fontSize: '14px' }}>
        {workStation.name}
      </div>

      {/* Nombre del nivel */}
      <div className="text-muted small mb-2">
        {levelConfig.name}
      </div>

      {/* Estadísticas */}
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-1">
          <i className="mdi mdi-account-group" style={{ color: levelConfig.bg, fontSize: '16px' }}></i>
          <span className="small">{workStation.employeeCount || 0}</span>
        </div>
        <div className="d-flex align-items-center gap-1">
          <i className="mdi mdi-clipboard-list" style={{ color: levelConfig.bg, fontSize: '16px' }}></i>
          <span className="small">{workStation.requirementCount || 0}</span>
        </div>
      </div>

      {/* Puesto padre (si no es raíz) */}
      {workStation.dependencyId !== 0 && workStation.dependencyName && (
        <div className="mt-2 pt-2 border-top">
          <div className="text-muted small">
            <i className="mdi mdi-arrow-up-circle me-1"></i>
            {workStation.dependencyName}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkStationNode;
