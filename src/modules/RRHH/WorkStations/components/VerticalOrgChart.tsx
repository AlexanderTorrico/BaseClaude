import React, { useState } from 'react';
import { Card, CardBody, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { WorkStationModel } from '@/modules/RRHH/shared/models/WorkStationModel';
import { getLevelColor } from '../utils/levelHelpers';

/**
 * Árbol Organizacional Vertical Compacto
 * - Diseño vertical en columna estrecha (4/12 cols)
 * - Nodos compactos para maximizar visualización
 * - Expand/Collapse por nodo padre
 */

interface VerticalOrgChartProps {
  workStations: WorkStationModel[];
  onSelectNode?: (workStation: WorkStationModel) => void;
  selectedNodeId?: number;
  onViewRequirements?: (workStation: WorkStationModel) => void;
  onEdit?: (workStation: WorkStationModel) => void;
  onDelete?: (workStation: WorkStationModel) => void;
}

const VerticalOrgChart: React.FC<VerticalOrgChartProps> = ({
  workStations,
  onSelectNode,
  selectedNodeId,
  onViewRequirements,
  onEdit,
  onDelete
}) => {
  // Estado para controlar qué nodos están expandidos (por ID)
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  /**
   * Toggle expand/collapse de un nodo
   */
  const toggleNode = (nodeId: number) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  /**
   * Expandir todos los nodos
   */
  const expandAll = () => {
    const allIds = new Set<number>();
    const collectIds = (nodes: WorkStationModel[]) => {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          allIds.add(node.id);
          collectIds(node.children);
        }
      });
    };
    collectIds(workStations);
    setExpandedNodes(allIds);
  };

  /**
   * Contraer todos los nodos
   */
  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  /**
   * Renderizar nodo individual de forma compacta
   */
  const renderCompactNode = (
    workStation: WorkStationModel,
    level: number = 0
  ): JSX.Element => {
    const hasChildren = workStation.children && workStation.children.length > 0;
    const isExpanded = expandedNodes.has(workStation.id);
    const isSelected = selectedNodeId === workStation.id;
    const levelConfig = getLevelColor(workStation.level);
    const indentPx = level * 20;

    return (
      <div key={workStation.id} className="compact-node-wrapper">
        {/* Nodo principal */}
        <div
          className={`compact-node ${isSelected ? 'selected' : ''}`}
          style={{
            paddingLeft: `${indentPx + 12}px`,
            borderLeft: `3px solid ${levelConfig.bg}`,
            backgroundColor: isSelected ? '#f0f7ff' : 'transparent',
            transition: 'all 0.2s ease'
          }}
          onClick={() => onSelectNode && onSelectNode(workStation)}
        >
          <div className="d-flex align-items-center gap-2">
            {/* Botón de expand/collapse */}
            {hasChildren && (
              <button
                className="btn btn-sm p-0"
                style={{
                  width: '20px',
                  height: '20px',
                  border: 'none',
                  background: 'transparent',
                  color: levelConfig.bg,
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(workStation.id);
                }}
              >
                <i className={`mdi ${isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
              </button>
            )}

            {/* Si no tiene hijos, espacio vacío para alineación */}
            {!hasChildren && <div style={{ width: '20px' }}></div>}

            {/* Badge de nivel compacto */}
            <Badge
              style={{
                backgroundColor: levelConfig.bg,
                color: levelConfig.text,
                fontSize: '9px',
                padding: '2px 6px'
              }}
              pill
            >
              N{workStation.level}
            </Badge>

            {/* Nombre del puesto */}
            <div className="flex-grow-1">
              <div
                className="fw-medium"
                style={{
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={workStation.name}
              >
                {workStation.name}
              </div>
            </div>

            {/* Estadísticas compactas */}
            <div className="d-flex align-items-center gap-2" style={{ fontSize: '11px' }}>
              <span className="text-muted d-flex align-items-center gap-1">
                <i className="mdi mdi-account-group"></i>
                {workStation.employeeCount || 0}
              </span>
              <span className="text-muted d-flex align-items-center gap-1">
                <i className="mdi mdi-clipboard-list"></i>
                {workStation.requirementCount || 0}
              </span>
            </div>

            {/* Menú de acciones */}
            <UncontrolledDropdown>
              <DropdownToggle
                tag="button"
                className="btn btn-sm btn-link text-muted p-0"
                style={{ fontSize: '16px' }}
                onClick={(e) => e.stopPropagation()}
              >
                <i className="mdi mdi-dots-vertical"></i>
              </DropdownToggle>
              <DropdownMenu end>
                {onViewRequirements && (
                  <DropdownItem onClick={(e) => {
                    e.stopPropagation();
                    onViewRequirements(workStation);
                  }}>
                    <i className="mdi mdi-clipboard-list text-info me-2"></i>
                    Ver Requisitos
                  </DropdownItem>
                )}
                {onEdit && (
                  <DropdownItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit(workStation);
                  }}>
                    <i className="mdi mdi-pencil text-warning me-2"></i>
                    Editar
                  </DropdownItem>
                )}
                {onDelete && (
                  <>
                    <DropdownItem divider />
                    <DropdownItem onClick={(e) => {
                      e.stopPropagation();
                      onDelete(workStation);
                    }}>
                      <i className="mdi mdi-delete text-danger me-2"></i>
                      Eliminar
                    </DropdownItem>
                  </>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>

        {/* Hijos (renderizar solo si está expandido) */}
        {hasChildren && isExpanded && (
          <div className="compact-node-children">
            {workStation.children!.map(child => renderCompactNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-100">
      <CardBody className="p-0">
        {/* Header con controles */}
        <div className="p-3 border-bottom bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              <i className="mdi mdi-file-tree me-2"></i>
              Organigrama
            </h6>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={expandAll}
                title="Expandir todo"
              >
                <i className="mdi mdi-arrow-expand-all"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={collapseAll}
                title="Contraer todo"
              >
                <i className="mdi mdi-arrow-collapse-all"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Árbol vertical scrollable */}
        <div
          className="vertical-org-chart"
          style={{
            height: 'calc(100vh - 350px)',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          {workStations.length > 0 ? (
            workStations.map(root => renderCompactNode(root, 0))
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="mdi mdi-file-tree-outline" style={{ fontSize: '48px' }}></i>
              <div className="mt-2">No hay puestos de trabajo</div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default VerticalOrgChart;
