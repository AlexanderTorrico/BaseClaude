import React from 'react'
import { Row, Col, Card, CardBody, Button, Badge } from "reactstrap";
const FilterInfoPanel = ({ 
  filters = [],
  sorting = null,
  onClearFilter,
  onClearSorting,
  onClearAll,
  totalResults,
  totalItems,
  className = "",
  isIntegrated = false // Para determinar si está integrado en otro card o es independiente
}) => {
  // Verificar si hay filtros o ordenamiento activos
  const hasActiveFilters = filters.length > 0 || (sorting && sorting.isActive);
  
  if (!hasActiveFilters) {
    return null;
  }

  const content = (
    <div className={`card-informative-section p-3 bg-light rounded ${isIntegrated ? '' : 'active-filters-container'}`}>
      <div className="d-flex align-items-start flex-wrap">
        <span className="text-muted small me-2 fw-medium mb-2">
          <i className="mdi mdi-filter-check me-1"></i>
          Filtros y ordenamiento activos:
        </span>
        
        {/* Mostrar ordenamiento activo */}
        {sorting && sorting.isActive && (
          <Badge 
            color="white" 
            className="filter-badge filter-badge-sort me-2 mb-2 d-flex align-items-center"
            style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
          >
            <i className={`mdi ${sorting.direction === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'} me-2 text-info`}></i>
            <span className="fw-medium text-dark text-capitalize">{sorting.column}</span>
            <span className="text-muted mx-1">{sorting.direction === 'asc' ? 'ascendente' : 'descendente'}</span>
            <Button
              color="link"
              size="sm"
              className="p-0 ms-2 text-danger"
              onClick={onClearSorting}
              style={{ fontSize: '0.7rem' }}
              title="Quitar ordenamiento"
            >
              <i className="mdi mdi-close"></i>
            </Button>
          </Badge>
        )}
        
        {/* Mostrar filtros activos */}
        {filters.map((filter, index) => (
          <Badge 
            key={`${filter.column}-${index}`}
            color="white" 
            className={`filter-badge ${filter.type === 'search' ? 'filter-badge-search' : 'filter-badge-column'} me-2 mb-2 d-flex align-items-center`}
            style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
          >
            <i className={`mdi ${filter.type === 'search' ? 'mdi-magnify' : 'mdi-filter'} me-2 ${filter.type === 'search' ? 'text-primary' : 'text-primary'}`}></i>
            <span className="fw-medium text-dark text-capitalize">
              {filter.type === 'search' ? 'Búsqueda' : filter.column}
            </span>
            <span className="text-muted mx-1">contiene</span>
            <span className="text-primary fw-medium">&quot;{filter.value}&quot;</span>
            <Button
              color="link"
              size="sm"
              className="p-0 ms-2 text-danger"
              onClick={() => onClearFilter(filter)}
              style={{ fontSize: '0.7rem' }}
              title={`Eliminar filtro ${filter.type === 'search' ? 'de búsqueda' : 'de ' + filter.column}`}
            >
              <i className="mdi mdi-close"></i>
            </Button>
          </Badge>
        ))}
        
        {/* Mostrar contador de resultados si se proporciona */}
        {totalResults !== undefined && totalItems !== undefined && (
          <small className="text-muted ms-2 d-flex align-items-center">
            <i className="mdi mdi-information-outline me-1"></i>
            {totalResults} de {totalItems} resultado{totalResults !== 1 ? 's' : ''}
          </small>
        )}
        
        <Button 
          color="link" 
          size="sm" 
          className="p-0 text-danger fw-medium ms-auto"
          onClick={onClearAll}
          title="Limpiar todo"
        >
          <i className="mdi mdi-close-circle me-1"></i>
          Limpiar todo
        </Button>
      </div>
    </div>
  );

  // Si está integrado, devolver solo el contenido
  if (isIntegrated) {
    return (
      <Row className={className}>
        <Col xs={12}>
          {content}
        </Col>
      </Row>
    );
  }

  // Si es independiente, envolver en Card
  return (
    <Card className={`border-0 shadow-sm mb-4 card-informative-panel ${className}`}>
      <CardBody className="p-3">
        {content}
      </CardBody>
    </Card>
  );
};

export default FilterInfoPanel;

