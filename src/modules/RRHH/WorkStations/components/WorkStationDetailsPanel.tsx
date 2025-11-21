import React from 'react';
import { Card, CardBody, Badge, Row, Col } from 'reactstrap';
import { WorkStationModel } from '@/modules/RRHH/shared/models/WorkStationModel';
import { getLevelColor } from '../utils/levelHelpers';

/**
 * Panel de Detalles del Puesto de Trabajo
 * Muestra información completa del nodo seleccionado
 */

interface WorkStationDetailsPanelProps {
  workStation: WorkStationModel | null;
  onViewRequirements?: (workStation: WorkStationModel) => void;
  onEdit?: (workStation: WorkStationModel) => void;
  onDelete?: (workStation: WorkStationModel) => void;
}

const WorkStationDetailsPanel: React.FC<WorkStationDetailsPanelProps> = ({
  workStation,
  onViewRequirements,
  onEdit,
  onDelete
}) => {
  if (!workStation) {
    return (
      <Card className="h-100">
        <CardBody className="d-flex flex-column align-items-center justify-content-center text-muted">
          <i className="mdi mdi-cursor-pointer" style={{ fontSize: '64px', opacity: 0.3 }}></i>
          <p className="mt-3 mb-0">Selecciona un puesto de trabajo del organigrama</p>
          <small>para ver sus detalles completos</small>
        </CardBody>
      </Card>
    );
  }

  const levelConfig = getLevelColor(workStation.level);

  return (
    <Card className="h-100">
      <CardBody>
        {/* Header con acciones */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-2">
              <Badge
                style={{
                  backgroundColor: levelConfig.bg,
                  color: levelConfig.text
                }}
                pill
              >
                Nivel {workStation.level}
              </Badge>
              <h5 className="mb-0">{workStation.name}</h5>
            </div>
            <p className="text-muted mb-0">{levelConfig.name}</p>
          </div>
        </div>

        {/* Indicador visual de nivel */}
        <div
          className="mb-4"
          style={{
            height: '4px',
            backgroundColor: levelConfig.bg,
            borderRadius: '2px'
          }}
        ></div>

        {/* Botones de acción */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {onViewRequirements && (
            <button
              className="btn btn-info btn-sm"
              onClick={() => onViewRequirements(workStation)}
            >
              <i className="mdi mdi-clipboard-list me-1"></i>
              Ver Requisitos
            </button>
          )}
          {onEdit && (
            <button
              className="btn btn-warning btn-sm"
              onClick={() => onEdit(workStation)}
            >
              <i className="mdi mdi-pencil me-1"></i>
              Editar
            </button>
          )}
          {onDelete && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(workStation)}
            >
              <i className="mdi mdi-delete me-1"></i>
              Eliminar
            </button>
          )}
        </div>

        {/* Estadísticas principales */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="border">
              <CardBody className="text-center">
                <i
                  className="mdi mdi-account-group"
                  style={{ fontSize: '32px', color: levelConfig.bg }}
                ></i>
                <h4 className="mt-2 mb-0">{workStation.employeeCount || 0}</h4>
                <small className="text-muted">Empleados Asignados</small>
              </CardBody>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border">
              <CardBody className="text-center">
                <i
                  className="mdi mdi-clipboard-list"
                  style={{ fontSize: '32px', color: levelConfig.bg }}
                ></i>
                <h4 className="mt-2 mb-0">{workStation.requirementCount || 0}</h4>
                <small className="text-muted">Requisitos Totales</small>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Información jerárquica */}
        <div className="mb-4">
          <h6 className="mb-3">
            <i className="mdi mdi-file-tree me-2"></i>
            Jerarquía
          </h6>

          {/* Puesto padre */}
          {workStation.dependencyId !== 0 && workStation.dependencyName && (
            <div className="mb-3 p-3 bg-light rounded border">
              <div className="d-flex align-items-center">
                <i className="mdi mdi-arrow-up-circle text-primary me-2" style={{ fontSize: '24px' }}></i>
                <div>
                  <small className="text-muted d-block">Reporta a:</small>
                  <strong>{workStation.dependencyName}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Puestos hijos */}
          {workStation.children && workStation.children.length > 0 && (
            <div className="p-3 bg-light rounded border">
              <div className="d-flex align-items-start">
                <i className="mdi mdi-arrow-down-circle text-success me-2 mt-1" style={{ fontSize: '24px' }}></i>
                <div className="flex-grow-1">
                  <small className="text-muted d-block mb-2">
                    Supervisa {workStation.children.length} puesto(s):
                  </small>
                  <ul className="list-unstyled mb-0">
                    {workStation.children.map(child => (
                      <li key={child.id} className="mb-1">
                        <Badge
                          color="light"
                          className="me-2"
                          style={{
                            border: `1px solid ${getLevelColor(child.level).bg}`,
                            color: getLevelColor(child.level).bg
                          }}
                        >
                          N{child.level}
                        </Badge>
                        {child.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Nodo raíz sin padre */}
          {workStation.dependencyId === 0 && (
            <div className="p-3 bg-light rounded border">
              <div className="d-flex align-items-center">
                <i className="mdi mdi-domain text-info me-2" style={{ fontSize: '24px' }}></i>
                <div>
                  <strong>Puesto Raíz</strong>
                  <small className="text-muted d-block">
                    Este puesto no reporta a ningún otro
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div>
          <h6 className="mb-3">
            <i className="mdi mdi-information me-2"></i>
            Información General
          </h6>
          <div className="table-responsive">
            <table className="table table-sm table-borderless">
              <tbody>
                <tr>
                  <td className="text-muted" style={{ width: '40%' }}>ID:</td>
                  <td><strong>{workStation.id}</strong></td>
                </tr>
                <tr>
                  <td className="text-muted">Nivel Jerárquico:</td>
                  <td>
                    <Badge
                      style={{
                        backgroundColor: levelConfig.bg,
                        color: levelConfig.text
                      }}
                    >
                      {workStation.level} - {levelConfig.name}
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td className="text-muted">Estado:</td>
                  <td>
                    <Badge color="success">Activo</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default WorkStationDetailsPanel;
