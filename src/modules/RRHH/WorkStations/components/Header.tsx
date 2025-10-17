import React, { useState } from 'react';
import { Row, Col, Card, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from 'reactstrap';
import { useWorkStations } from '../hooks/useWorkStations';
import { AzHeaderCardViews } from '@/components/aziende/AzHeader';

/**
 * Header component para WorkStations
 * - View switcher (Organigrama / Lista jer�rquica / Tabla)
 * - Filtro por nivel
 * - Estad�sticas generales
 */

const Header: React.FC = () => {
  const {
    workStations,
    currentView,
    selectedLevel,
    availableLevels,
    levelStatistics,
    setCurrentView,
    setSelectedLevel,
    clearFilters
  } = useWorkStations();

  const [workStationFormModalOpen, setWorkStationFormModalOpen] = useState(false);

  // Vista opciones
  const viewOptions = [
    { key: '0', label: 'Organigrama', icon: 'mdi mdi-file-tree' },
    { key: '1', label: 'Lista Jer�rquica', icon: 'mdi mdi-format-list-bulleted-type' },
    { key: '2', label: 'Tabla', icon: 'mdi mdi-table' }
  ];

  const totalWorkStations = workStations.length;
  const totalLevels = availableLevels.length;

  const handleViewChange = (viewKey: string) => {
    setCurrentView(viewKey);
  };

  const handleLevelFilter = (level: number | null) => {
    setSelectedLevel(level);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleOpenAddModal = () => {
    setWorkStationFormModalOpen(true);
  };

  return (
    <div className="page-content">
      <Row>
        <Col xs="12">
          <AzHeaderCardViews
            title="Puestos de Trabajo"
            subtitle={`${totalWorkStations} puestos en ${totalLevels} niveles`}
            views={viewOptions}
            activeView={currentView}
            onViewChange={handleViewChange}
            actions={
              <>
                {/* Filtro por nivel */}
                <UncontrolledDropdown className="me-2">
                  <DropdownToggle
                    tag="button"
                    className="btn btn-soft-secondary"
                    caret
                  >
                    <i className="mdi mdi-filter-variant me-1"></i>
                    {selectedLevel !== null ? `Nivel ${selectedLevel}` : 'Todos los niveles'}
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem
                      onClick={() => handleLevelFilter(null)}
                      active={selectedLevel === null}
                    >
                      <i className="mdi mdi-check-all me-2"></i>
                      Todos los niveles
                    </DropdownItem>
                    <DropdownItem divider />
                    {levelStatistics.map(stat => (
                      <DropdownItem
                        key={stat.level}
                        onClick={() => handleLevelFilter(stat.level)}
                        active={selectedLevel === stat.level}
                      >
                        <Badge
                          style={{
                            backgroundColor: stat.color,
                            color: '#ffffff',
                            marginRight: '8px'
                          }}
                          pill
                        >
                          {stat.level}
                        </Badge>
                        {stat.levelName}
                        <span className="text-muted ms-2">({stat.count})</span>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>

                {/* Bot�n limpiar filtros */}
                {selectedLevel !== null && (
                  <button
                    className="btn btn-soft-danger me-2"
                    onClick={handleClearFilters}
                  >
                    <i className="mdi mdi-filter-remove me-1"></i>
                    Limpiar filtros
                  </button>
                )}

                {/* Bot�n agregar */}
                <button
                  className="btn btn-primary"
                  onClick={handleOpenAddModal}
                >
                  <i className="mdi mdi-plus me-1"></i>
                  Nuevo Puesto
                </button>
              </>
            }
          />
        </Col>
      </Row>

      {/* Estad�sticas por nivel (solo mostrar si no hay filtro activo) */}
      {selectedLevel === null && levelStatistics.length > 0 && (
        <Row className="mb-3">
          <Col xs="12">
            <Card>
              <CardBody>
                <div className="d-flex flex-wrap gap-2">
                  {levelStatistics.map(stat => (
                    <div
                      key={stat.level}
                      className="d-flex align-items-center gap-2 p-2 border rounded"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleLevelFilter(stat.level)}
                    >
                      <div
                        style={{
                          width: '4px',
                          height: '32px',
                          backgroundColor: stat.color,
                          borderRadius: '2px'
                        }}
                      ></div>
                      <div>
                        <div className="text-muted small">Nivel {stat.level}</div>
                        <div className="fw-medium">{stat.levelName}</div>
                        <div className="text-primary small">{stat.count} puestos ({stat.percentage}%)</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Header;
