import React from 'react';
import { Card, CardBody, ListGroup, ListGroupItem, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { useWorkStations } from '../hooks/useWorkStations';
import { getLevelColor } from '../utils/levelHelpers';

/**
 * Vista de Lista Jerárquica
 * Muestra workstations agrupados por nivel con indentación
 */

const WorkStationListView: React.FC = () => {
  const {
    workStationsByLevel,
    availableLevels,
    loading,
    error,
    openSidebar
  } = useWorkStations();

  if (loading) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
          <div className="mt-2">Cargando lista...</div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <i className="mdi mdi-alert-circle text-danger" style={{ fontSize: '48px' }}></i>
          <div className="mt-2 text-danger">{error}</div>
        </CardBody>
      </Card>
    );
  }

  if (availableLevels.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <i className="mdi mdi-format-list-bulleted-type text-muted" style={{ fontSize: '48px' }}></i>
          <div className="mt-2 text-muted">No hay puestos de trabajo para mostrar</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div>
      {availableLevels.map(level => {
        const levelConfig = getLevelColor(level);
        const workStations = workStationsByLevel[level] || [];

        if (workStations.length === 0) return null;

        return (
          <Card key={level} className="mb-3">
            <CardBody>
              {/* Header del nivel */}
              <div className="d-flex align-items-center mb-3">
                <div
                  style={{
                    width: '4px',
                    height: '32px',
                    backgroundColor: levelConfig.bg,
                    borderRadius: '2px',
                    marginRight: '12px'
                  }}
                ></div>
                <div>
                  <Badge
                    style={{
                      backgroundColor: levelConfig.bg,
                      color: levelConfig.text
                    }}
                    pill
                    className="me-2"
                  >
                    Nivel {level}
                  </Badge>
                  <span className="fw-medium">{levelConfig.name}</span>
                  <span className="text-muted ms-2">({workStations.length})</span>
                </div>
              </div>

              {/* Lista de workstations */}
              <ListGroup flush>
                {workStations.map(ws => (
                  <ListGroupItem
                    key={ws.id}
                    className="d-flex justify-content-between align-items-center"
                    style={{
                      paddingLeft: `${(ws.level + 1) * 20}px`,
                      borderLeft: `3px solid ${levelConfig.bg}`,
                      marginLeft: '8px',
                      marginBottom: '8px'
                    }}
                  >
                    <div className="flex-grow-1">
                      <div className="fw-medium">{ws.name}</div>
                      {ws.dependencyName && (
                        <div className="text-muted small">
                          <i className="mdi mdi-arrow-up-circle me-1"></i>
                          Depende de: {ws.dependencyName}
                        </div>
                      )}
                      <div className="d-flex gap-3 mt-1">
                        <span className="text-muted small">
                          <i className="mdi mdi-account-group me-1"></i>
                          {ws.employeeCount || 0} empleados
                        </span>
                        <span className="text-muted small">
                          <i className="mdi mdi-clipboard-list me-1"></i>
                          {ws.requirementCount || 0} requisitos
                        </span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <UncontrolledDropdown>
                      <DropdownToggle
                        tag="button"
                        className="btn btn-sm btn-soft-secondary"
                      >
                        <i className="mdi mdi-dots-vertical"></i>
                      </DropdownToggle>
                      <DropdownMenu end>
                        <DropdownItem onClick={() => openSidebar(ws)}>
                          <i className="mdi mdi-clipboard-list text-info me-2"></i>
                          Ver Requisitos
                        </DropdownItem>
                        <DropdownItem onClick={() => console.log('Edit:', ws)}>
                          <i className="mdi mdi-pencil text-warning me-2"></i>
                          Editar
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => console.log('Delete:', ws)}>
                          <i className="mdi mdi-delete text-danger me-2"></i>
                          Eliminar
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default WorkStationListView;
