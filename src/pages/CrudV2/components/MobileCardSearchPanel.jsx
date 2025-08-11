import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody, InputGroup, InputGroupText, Input, Button, Badge, Collapse } from "reactstrap";

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
        {/* Header principal para móvil */}
        <div className="mb-3">
          <h5 className="mb-2 text-dark fw-bold">Gestión de Usuarios V2</h5>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center flex-wrap">
              <small className="text-muted me-2">Vista de Tarjetas</small>
              <Badge 
                color="info" 
                className="d-flex align-items-center px-2 py-1 me-2"
                style={{ fontSize: '0.7rem' }}
              >
                <i className="mdi mdi-account-group me-1"></i>
                <span className="fw-medium">
                  {totalResults}
                  {hasActiveCardFilters && (
                    <span className="opacity-75">/{totalUsers}</span>
                  )}
                </span>
              </Badge>
              {hasActiveCardFilters && (
                <Badge color="warning" style={{ fontSize: '0.65rem' }}>
                  <i className="mdi mdi-filter-check me-1"></i>
                  Filtrado
                </Badge>
              )}
            </div>
            
            {/* Botones de acción para móvil */}
            <div className="d-flex align-items-center gap-2">
              <Button 
                color="primary" 
                size="sm"
                onClick={onAddUser}
                className="d-flex align-items-center"
              >
                <i className="mdi mdi-plus me-1"></i>
                Nuevo
              </Button>
              
              {/* Botón para expandir controles */}
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
        </div>

        {/* Búsqueda rápida - Siempre visible */}
        <Row className="mb-2">
          <Col xs={12}>
            <InputGroup size="sm">
              <InputGroupText>
                <i className="mdi mdi-magnify text-muted"></i>
              </InputGroupText>
              <Input
                type="text"
                value={cardSearchTerm}
                onChange={(e) => handleCardSearchChange(e.target.value)}
                placeholder="Buscar usuarios..."
                className="form-control"
              />
              {cardSearchTerm && (
                <Button
                  color="outline-secondary"
                  size="sm"
                  onClick={() => handleCardSearchChange('')}
                  title="Limpiar búsqueda"
                >
                  <i className="mdi mdi-close"></i>
                </Button>
              )}
            </InputGroup>
          </Col>
        </Row>

        {/* Controles expandibles */}
        <Collapse isOpen={isOpen}>
          <Row className="g-2">
            {/* Ordenamiento por campo */}
            <Col xs={8}>
              <Input
                type="select"
                size="sm"
                value={cardSorting.field}
                onChange={(e) => handleCardSortFieldChange(e.target.value)}
                title="Campo de ordenamiento"
              >
                <option value="nombre">Ordenar por Nombre</option>
                <option value="rol">Ordenar por Rol</option>
                <option value="departamento">Ordenar por Departamento</option>
                <option value="estado">Ordenar por Estado</option>
                <option value="salario">Ordenar por Salario</option>
                <option value="email">Ordenar por Email</option>
              </Input>
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

          {/* Indicador de filtros activos */}
          {hasActiveCardFilters && (
            <div className="mt-2 p-2 bg-light rounded border-start border-primary border-2">
              <div className="small text-muted mb-1">
                <i className="mdi mdi-information-outline me-1"></i>
                Filtros activos:
              </div>
              
              {/* Búsqueda activa */}
              {cardSearchTerm && (
                <Badge 
                  color="white" 
                  className="border border-primary me-1 mb-1 d-inline-flex align-items-center"
                  style={{ fontSize: '0.7rem', padding: '0.4rem 0.6rem' }}
                >
                  <i className="mdi mdi-magnify me-1 text-primary"></i>
                  <span className="text-primary fw-medium">&quot;{cardSearchTerm}&quot;</span>
                  <Button
                    color="link"
                    size="sm"
                    className="p-0 ms-1 text-danger"
                    onClick={() => handleCardSearchChange('')}
                    style={{ fontSize: '0.6rem' }}
                  >
                    <i className="mdi mdi-close"></i>
                  </Button>
                </Badge>
              )}
              
              {/* Ordenamiento no predeterminado */}
              {(cardSorting.field !== 'nombre' || cardSorting.direction !== 'asc') && (
                <Badge 
                  color="white" 
                  className="border border-info me-1 mb-1 d-inline-flex align-items-center"
                  style={{ fontSize: '0.7rem', padding: '0.4rem 0.6rem' }}
                >
                  <i className={`mdi ${cardSorting.direction === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'} me-1 text-info`}></i>
                  <span className="text-dark text-capitalize">{cardSorting.field}</span>
                  <Button
                    color="link"
                    size="sm"
                    className="p-0 ms-1 text-danger"
                    onClick={() => {
                      handleCardSortFieldChange('nombre');
                      handleCardSortDirectionChange('asc');
                    }}
                    style={{ fontSize: '0.6rem' }}
                  >
                    <i className="mdi mdi-close"></i>
                  </Button>
                </Badge>
              )}
            </div>
          )}
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