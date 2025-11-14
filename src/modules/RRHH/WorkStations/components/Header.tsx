import React, { useState } from 'react';
import { Card, CardHeader, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge, Button } from 'reactstrap';
import { useWorkStations } from '../hooks/useWorkStations';

/**
 * Header simplificado para WorkStations
 * - Título y contador
 * - Filtro por nivel
 * - Botón nuevo puesto
 */

const Header: React.FC = () => {
  const {
    workStations,
    selectedLevel,
    availableLevels,
    levelStatistics,
    setSelectedLevel,
    clearFilters
  } = useWorkStations();

  const [workStationFormModalOpen, setWorkStationFormModalOpen] = useState(false);

  const totalWorkStations = workStations.length;
  const totalLevels = availableLevels.length;

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
    <Card className="mb-3 bg-white">
      <CardHeader className="bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="card-title mb-1">Puestos de Trabajo</h4>
            <p className="text-muted mb-0">
              {totalWorkStations} puestos en {totalLevels} niveles
            </p>
          </div>

          <div className="d-flex gap-2">
            {/* Filtro por nivel */}
            <UncontrolledDropdown>
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

            {/* Botón limpiar filtros */}
            {selectedLevel !== null && (
              <Button
                color="soft-danger"
                onClick={handleClearFilters}
              >
                <i className="mdi mdi-filter-remove me-1"></i>
                Limpiar filtros
              </Button>
            )}

            {/* Botón agregar */}
            <Button
              color="primary"
              onClick={handleOpenAddModal}
            >
              <i className="mdi mdi-plus me-1"></i>
              Nuevo Puesto
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default Header;
