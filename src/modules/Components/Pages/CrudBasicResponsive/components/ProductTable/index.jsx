import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import FilterSummary from "../../../../../../components/aziende/AzFilterSummary";
import { AzTable } from "../../../../../../components/aziende/AzTable";
import ProductFilters from "../ProductFilters";
import { getProductTableColumns, getFilterableColumns } from "./ProductTableColumns.jsx";

const ProductTable = ({
  products,
  loading,
  updating,
  deleting,
  selectedItems,
  totalCount,
  hasSelection,
  selectedCount,
  onEdit,
  onDelete,
  selectItem,
  onBulkDelete
}) => {
  // Get table columns with event handlers
  const columns = getProductTableColumns({
    onEdit,
    onDelete,
    isUpdating: updating,
    isDeleting: deleting
  });

  // Get filterable columns for FilterSummary
  const filterableColumns = getFilterableColumns();

  const renderEmptyState = (hasActiveItems = false) => (
    <div className="text-center py-5">
      <div className="avatar-lg rounded-circle bg-light mx-auto mb-4 d-flex align-items-center justify-content-center">
        <i className="mdi mdi-package-variant mdi-36px text-muted"></i>
      </div>
      <h5 className="mb-3">No se encontraron productos</h5>
      <p className="text-muted mb-0">
        {hasActiveItems
          ? "No hay productos que coincidan con los criterios de búsqueda aplicados."
          : "No hay productos registrados en el sistema."}
      </p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <h1>Hola mundo</h1>
      </CardHeader>
      <CardBody>
        <FilterSummary data={products} columns={filterableColumns}>
          {({ filteredData, hasActiveItems, filters, sorting, onFilterChange, onSortChange, onClearAll }) => (
            <>
              {/* Filter Controls */}
              <ProductFilters
                filters={filters}
                sorting={sorting}
                onFilterChange={onFilterChange}
                onSortChange={onSortChange}
                onClearAll={onClearAll}
                variant="desktop"
              />

              {/* Results Summary */}
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <h6 className="text-muted mb-0">
                  Mostrando {filteredData.length} de {totalCount} productos
                  {hasActiveItems && <span className="text-primary"> (filtrados)</span>}
                </h6>

                {hasSelection && onBulkDelete && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={onBulkDelete}
                    disabled={deleting}
                  >
                    <i className="mdi mdi-delete me-1"></i>
                    Eliminar seleccionados ({selectedCount})
                  </button>
                )}
              </div>

              {/* Table */}
              {filteredData.length > 0 ? (
                <AzTable
                  data={filteredData}
                  columns={columns}
                  selectedItems={selectedItems}
                  onSelectedChange={selectItem}
                  loading={loading}
                  pagination={false} // Handled externally
                  className="table-responsive"
                />
              ) : (
                renderEmptyState(hasActiveItems)
              )}
            </>
          )}
        </FilterSummary>
      </CardBody>
    </Card>
  );
};

ProductTable.propTypes = {
  // Data
  products: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,

  // Loading states
  loading: PropTypes.bool,
  updating: PropTypes.bool,
  deleting: PropTypes.bool,

  // Selection
  selectedItems: PropTypes.array.isRequired,
  hasSelection: PropTypes.bool,
  selectedCount: PropTypes.number,

  // Event handlers
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selectItem: PropTypes.func.isRequired,
  onBulkDelete: PropTypes.func
};

ProductTable.defaultProps = {
  loading: false,
  updating: false,
  deleting: false,
  hasSelection: false,
  selectedCount: 0
};

export default ProductTable;