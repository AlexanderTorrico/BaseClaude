import React, { cloneElement } from "react";
import { Row, Col, Card, CardBody, Button, Badge, InputGroup, InputGroupText, Input } from "reactstrap";
import PropTypes from "prop-types";
import FilterInfoPanel from "../../CrudComponents/FilterInfoPanel";
import CustomSelect from "../../CrudComponents/CustomSelect";
import { opcionesOrdenamiento } from "../../../pages/CrudV2/config/userConstants.js";

const ConfigurableHeader = ({
  title,
  description,
  viewMode,
  setViewMode,
  selectedItems,
  filteredData,
  data,
  getActiveFilters,
  sorting,
  clearColumnFilter,
  clearSorting,
  clearAll,
  onAddItem,
  onBulkDelete,
  headerActionsSlot,
  searchComponentSlot,
  // Card search props
  cardSearchTerm,
  cardSorting,
  filteredCardsData,
  handleCardSearchChange,
  handleCardSortFieldChange,
  handleCardSortDirectionChange,
  clearCardFilters,
  getActiveCardFilters,
  // Nueva prop para detectar vistas disponibles
  availableViews
}) => {
  const renderDefaultActions = () => (
    <div className="d-flex flex-wrap gap-2 justify-content-lg-end justify-content-center">
      <Button color="primary" onClick={onAddItem} size="sm">
        <i className="mdi mdi-plus me-1"></i>
        Nuevo Usuario
      </Button>
      
      {selectedItems.length > 0 && (
        <Button color="danger" outline onClick={onBulkDelete} size="sm">
          <i className="mdi mdi-delete me-1"></i>
          Eliminar ({selectedItems.length})
        </Button>
      )}

      {/* Solo mostrar selector si hay vistas web o card disponibles */}
      {availableViews && (availableViews.hasWebView || availableViews.hasCardView) && (
        <div className="btn-group d-none d-md-flex" role="group">
          <Button 
            color={viewMode === 'table' ? 'primary' : 'light'}
            onClick={() => setViewMode('table')}
            size="sm"
            title="Vista Web (Tabla)"
          >
            <i className="mdi mdi-monitor"></i>
            <span className="d-none d-lg-inline ms-1">Web</span>
          </Button>
          <Button 
            color={viewMode === 'cards' ? 'primary' : 'light'}
            onClick={() => setViewMode('cards')}
            size="sm"
            title="Vista Móvil (Cards)"
          >
            <i className="mdi mdi-cellphone"></i>
            <span className="d-none d-lg-inline ms-1">Móvil</span>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Header siempre visible */}
      <Card className="border-0 shadow-sm mb-4">
        <CardBody>
          <Row className="align-items-center">
            <Col lg={6} md={12}>
              <h4 className="mb-0">{title}</h4>
              <p className="text-muted mb-md-0 mb-3">
                {description}
                {viewMode === 'table' && (getActiveFilters().length > 0 || (sorting.column && sorting.direction)) && (
                  <span className="ms-2">
                    <Badge color="info" style={{ fontSize: '0.65rem' }}>
                      <i className="mdi mdi-filter-check me-1"></i>
                      {filteredData.length} de {data.length} resultados
                    </Badge>
                  </span>
                )}
                {viewMode === 'cards' && (cardSearchTerm || (cardSorting.field && cardSorting.field !== 'nombre') || cardSorting.direction === 'desc') && (
                  <span className="ms-2">
                    <Badge color="info" style={{ fontSize: '0.65rem' }}>
                      <i className="mdi mdi-filter-check me-1"></i>
                      {filteredCardsData.length} de {data.length} resultados
                    </Badge>
                  </span>
                )}
              </p>
            </Col>
            <Col lg={6} md={12} className="text-lg-end text-center">
              {headerActionsSlot 
                ? cloneElement(headerActionsSlot, {
                    viewMode,
                    setViewMode,
                    selectedItems,
                    onAddItem,
                    onBulkDelete
                  })
                : renderDefaultActions()
              }
            </Col>
          </Row>

          {/* Card search controls - only in card view */}
          {viewMode === 'cards' && (
            <Row className="mt-3">
              <Col lg={6} md={12}>
                <InputGroup size="sm">
                  <InputGroupText>
                    <i className="mdi mdi-magnify"></i>
                  </InputGroupText>
                  <Input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={cardSearchTerm}
                    onChange={(e) => handleCardSearchChange(e.target.value)}
                  />
                </InputGroup>
              </Col>
              
              <Col lg={6} md={12} className="mt-3 mt-lg-0">
                <Row>
                  <Col md={6}>
                    <CustomSelect
                      value={cardSorting.field}
                      onChange={handleCardSortFieldChange}
                      options={opcionesOrdenamiento}
                      placeholder="Ordenar por"
                    />
                  </Col>
                  <Col md={6} className="mt-2 mt-md-0">
                    <div className="btn-group w-100" role="group">
                      <Button
                        color={cardSorting.direction === 'asc' ? 'primary' : 'light'}
                        onClick={() => handleCardSortDirectionChange('asc')}
                        size="sm"
                      >
                        <i className="mdi mdi-sort-alphabetical-ascending"></i>
                      </Button>
                      <Button
                        color={cardSorting.direction === 'desc' ? 'primary' : 'light'}
                        onClick={() => handleCardSortDirectionChange('desc')}
                        size="sm"
                      >
                        <i className="mdi mdi-sort-alphabetical-descending"></i>
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}

          {searchComponentSlot && (
            <Row className="mt-3">
              <Col xs={12}>
                {cloneElement(searchComponentSlot, {
                  filteredData,
                  data,
                  getActiveFilters,
                  sorting,
                  clearColumnFilter,
                  clearSorting,
                  clearAll
                })}
              </Col>
            </Row>
          )}

          {viewMode === 'table' && (
            <FilterInfoPanel
              filters={getActiveFilters().map(([column, value]) => ({
                column,
                value,
                type: 'column'
              }))}
              sorting={sorting.column && sorting.direction ? {
                column: sorting.column,
                direction: sorting.direction,
                isActive: true
              } : null}
              onClearFilter={(filter) => clearColumnFilter(filter.column)}
              onClearSorting={clearSorting}
              onClearAll={clearAll}
              totalResults={filteredData.length}
              totalItems={data.length}
              isIntegrated={true}
              className="mt-3"
            />
          )}

          {viewMode === 'cards' && (cardSearchTerm || (cardSorting.field && cardSorting.field !== 'nombre') || cardSorting.direction === 'desc') && (
            <FilterInfoPanel
              filters={cardSearchTerm ? [['search', cardSearchTerm]] : []}
              sorting={cardSorting.field && cardSorting.direction ? {
                column: cardSorting.field,
                direction: cardSorting.direction,
                isActive: true
              } : null}
              onClearFilter={() => handleCardSearchChange('')}
              onClearSorting={() => {
                handleCardSortFieldChange('nombre');
                handleCardSortDirectionChange('asc');
              }}
              onClearAll={clearCardFilters}
              totalResults={filteredCardsData.length}
              totalItems={data.length}
              isIntegrated={true}
              className="mt-3"
            />
          )}
        </CardBody>
      </Card>
    </>
  );
};

ConfigurableHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  viewMode: PropTypes.string.isRequired,
  setViewMode: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
  filteredData: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  getActiveFilters: PropTypes.func.isRequired,
  sorting: PropTypes.object.isRequired,
  clearColumnFilter: PropTypes.func.isRequired,
  clearSorting: PropTypes.func.isRequired,
  clearAll: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onBulkDelete: PropTypes.func.isRequired,
  headerActionsSlot: PropTypes.node,
  searchComponentSlot: PropTypes.node,
  // Card search props
  cardSearchTerm: PropTypes.string.isRequired,
  cardSorting: PropTypes.object.isRequired,
  filteredCardsData: PropTypes.array.isRequired,
  handleCardSearchChange: PropTypes.func.isRequired,
  handleCardSortFieldChange: PropTypes.func.isRequired,
  handleCardSortDirectionChange: PropTypes.func.isRequired,
  clearCardFilters: PropTypes.func.isRequired,
  getActiveCardFilters: PropTypes.func.isRequired,
  // Nueva prop para vistas disponibles
  availableViews: PropTypes.shape({
    hasWebView: PropTypes.bool,
    hasCardView: PropTypes.bool,
    hasMobileView: PropTypes.bool
  })
};

export default ConfigurableHeader;