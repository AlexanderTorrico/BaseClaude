import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody, InputGroup, InputGroupText, Input, Button, Badge, Collapse } from "reactstrap";
import CustomSelect from "./CustomSelect";
import FilterInfoPanel from "./FilterInfoPanel";
import { opcionesOrdenamiento } from "../utils/constants.js";

const MobileCardSearchPanel = ({ 
  usuariosFiltrados,
  usuarios,
  cardSearchTerm,
  cardSorting,
  handleCardSearchChange,
  handleCardSortFieldChange,
  handleCardSortDirectionChange,
  clearCardFilters,
  getActiveCardFilters,
  // Props para acciones
  onAddUser,
  onBulkDelete, // eslint-disable-line no-unused-vars
  selectedUsers, // eslint-disable-line no-unused-vars
  onViewModeChange, // eslint-disable-line no-unused-vars
  currentViewMode // eslint-disable-line no-unused-vars
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasActiveCardFilters = getActiveCardFilters().length > 0 || (cardSorting.field !== 'nombre' || cardSorting.direction !== 'asc');
  const totalResults = usuariosFiltrados.length;
  const totalUsers = usuarios.length;

  return (
    <Card className="border-0 shadow-sm mb-3">
      <CardBody className="p-3">
        {/* Header principal para móvil - ESTANDARIZADO */}
        <Row className="align-items-center mb-3">
          <Col xs={12}>
            <div className="d-flex justify-content-between align-items-start flex-wrap">
              <div className="mb-2 mb-md-0">
                <h4 className="mb-0">Gestión de Usuarios V2</h4>
                <p className="text-muted mb-0 small">
                  Sistema moderno de administración de usuarios con filtros avanzados
                  {hasActiveCardFilters && (
                    <span className="ms-2">
                      <Badge color="info" style={{ fontSize: '0.65rem' }}>
                        <i className="mdi mdi-filter-check me-1"></i>
                        {totalResults} de {totalUsers} resultados
                      </Badge>
                    </span>
                  )}
                </p>
              </div>
              
              <div className="d-flex flex-wrap gap-2 justify-content-end">
                <Button color="primary" onClick={onAddUser} size="sm">
                  <i className="mdi mdi-plus me-1"></i>
                  Nuevo Usuario
                </Button>
                
                {/* Botón para expandir controles - Móvil específico */}
                <Button
                  color="light"
                  size="sm"
                  onClick={() => setIsOpen(!isOpen)}
                  className="d-flex align-items-center"
                  title={isOpen ? "Ocultar filtros" : "Mostrar filtros"}
                >
                  <i className={`mdi ${isOpen ? 'mdi-chevron-up' : 'mdi-tune'} me-1`}></i>
                  {isOpen ? 'Ocultar' : 'Filtros'}
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Search Controls Row - ESTANDARIZADO */}
        <Row className="g-2 align-items-end mb-3">
          <Col xs={12} sm={8}>
            <InputGroup size="sm" className="search-input-group">
              <InputGroupText className="bg-light">
                <i className="mdi mdi-magnify text-muted"></i>
              </InputGroupText>
              <Input
                type="text"
                placeholder="Buscar usuarios..."
                value={cardSearchTerm}
                onChange={(e) => handleCardSearchChange(e.target.value)}
                className="form-control-sm search-input-enhanced"
              />
              {cardSearchTerm && (
                <InputGroupText 
                  className="bg-light cursor-pointer"
                  onClick={() => handleCardSearchChange("")}
                  title="Limpiar búsqueda"
                >
                  <i className="mdi mdi-close text-muted"></i>
                </InputGroupText>
              )}
            </InputGroup>
          </Col>
          
          <Col xs={12} sm={4}>
            <div className="text-end">
              {hasActiveCardFilters && (
                <Button 
                  color="outline-secondary" 
                  size="sm"
                  onClick={clearCardFilters}
                  className="d-inline-flex align-items-center"
                  title="Limpiar todos los filtros"
                >
                  <i className="mdi mdi-filter-remove me-1"></i>
                  Limpiar filtros
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* Controles expandibles */}
        <Collapse isOpen={isOpen}>
          <Row className="g-2">
            {/* Ordenamiento por campo */}
            <Col xs={8}>
              <CustomSelect
                value={cardSorting.field}
                onChange={handleCardSortFieldChange}
                options={opcionesOrdenamiento}
                placeholder="Ordenar por"
                icon="mdi-sort"
                size="sm"
              />
            </Col>
            
            {/* Dirección de ordenamiento */}
            <Col xs={2}>
              <Button
                color={cardSorting.direction === 'desc' ? 'primary' : 'light'}
                size="sm"
                onClick={() => handleCardSortDirectionChange(cardSorting.direction === 'asc' ? 'desc' : 'asc')}
                className="w-100"
                title={`Orden ${cardSorting.direction === 'asc' ? 'descendente' : 'ascendente'}`}
              >
                <i className={`mdi ${cardSorting.direction === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'}`}></i>
              </Button>
            </Col>
            
            {/* Limpiar filtros */}
            <Col xs={2}>
              {hasActiveCardFilters && (
                <Button 
                  color="outline-danger" 
                  size="sm"
                  onClick={clearCardFilters}
                  className="w-100"
                  title="Limpiar filtros"
                >
                  <i className="mdi mdi-filter-remove"></i>
                </Button>
              )}
            </Col>
          </Row>

          {/* FilterInfoPanel integrado - ESTANDARIZADO */}
          <FilterInfoPanel
            filters={cardSearchTerm ? [{
              column: 'búsqueda',
              value: cardSearchTerm,
              type: 'search'
            }] : []}
            sorting={(cardSorting.field && cardSorting.field !== 'nombre') || cardSorting.direction === 'desc' ? {
              column: cardSorting.field,
              direction: cardSorting.direction,
              isActive: true
            } : null}
            onClearFilter={(filter) => {
              if (filter.type === 'search') {
                handleCardSearchChange('');
              }
            }}
            onClearSorting={() => {
              handleCardSortFieldChange('nombre');
              handleCardSortDirectionChange('asc');
            }}
            onClearAll={clearCardFilters}
            totalResults={totalResults}
            totalItems={totalUsers}
            isIntegrated={true}
            className="mt-2"
          />
        </Collapse>

        {/* Estado cuando no hay resultados */}
        {totalResults === 0 && hasActiveCardFilters && (
          <div className="alert alert-warning border-start border-warning border-4 mb-0 mt-2" role="alert">
            <div className="d-flex align-items-center">
              <i className="mdi mdi-alert-circle me-2"></i>
              <div>
                <strong className="small">Sin resultados</strong>
                <div className="small text-muted">
                  {cardSearchTerm ? 
                    `No hay usuarios que coincidan con &quot;${cardSearchTerm}&quot;` :
                    'No se encontraron usuarios con los filtros aplicados'
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

MobileCardSearchPanel.propTypes = {
  usuariosFiltrados: PropTypes.array.isRequired,
  usuarios: PropTypes.array.isRequired,
  cardSearchTerm: PropTypes.string.isRequired,
  cardSorting: PropTypes.shape({
    field: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }).isRequired,
  handleCardSearchChange: PropTypes.func.isRequired,
  handleCardSortFieldChange: PropTypes.func.isRequired,
  handleCardSortDirectionChange: PropTypes.func.isRequired,
  clearCardFilters: PropTypes.func.isRequired,
  getActiveCardFilters: PropTypes.func.isRequired,
  // Props para acciones
  onAddUser: PropTypes.func.isRequired,
  onBulkDelete: PropTypes.func,
  selectedUsers: PropTypes.array,
  onViewModeChange: PropTypes.func,
  currentViewMode: PropTypes.string,
};

export default MobileCardSearchPanel;