import React, { cloneElement } from "react";
import { Row, Col, Card, CardBody, Button, Badge } from "reactstrap";
import PropTypes from "prop-types";
import FilterInfoPanel from "../../CrudComponents/FilterInfoPanel";

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
  searchComponentSlot
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

      <div className="btn-group d-none d-md-flex" role="group">
        <Button 
          color={viewMode === 'cards' ? 'primary' : 'light'}
          onClick={() => setViewMode('cards')}
          size="sm"
          title="Vista de tarjetas"
        >
          <i className="mdi mdi-view-grid"></i>
        </Button>
        <Button 
          color={viewMode === 'table' ? 'primary' : 'light'}
          onClick={() => setViewMode('table')}
          size="sm"
          title="Vista de tabla"
        >
          <i className="mdi mdi-view-list"></i>
        </Button>
      </div>
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
  searchComponentSlot: PropTypes.node
};

export default ConfigurableHeader;