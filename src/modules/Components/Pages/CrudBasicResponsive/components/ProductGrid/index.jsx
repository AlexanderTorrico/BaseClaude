import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import FilterSummary from "../../../../../../components/aziende/AzFilterSummary";
import ProductCard from "../ProductCard";
import ProductFilters from "../ProductFilters";
import { getFilterableColumns } from "../ProductTable/ProductTableColumns.jsx";

const ProductGrid = ({
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
  // Get filterable columns for FilterSummary
  const filterableColumns = getFilterableColumns();

  const renderEmptyState = (hasActiveItems = false) => (
    <Col xs={12}>
      <div className="text-center py-5">
        <div className="avatar-lg rounded-circle bg-light mx-auto mb-4 d-flex align-items-center justify-content-center">
          <i className="mdi mdi-package-variant mdi-36px text-muted"></i>
        </div>
        <h5 className="mb-3">No se encontraron productos</h5>
        <p className="text-muted mb-0">
          {hasActiveItems
            ? "No hay productos que coincidan con los filtros."
            : "No hay productos registrados."}
        </p>
      </div>
    </Col>
  );

  return (
    <FilterSummary data={products} columns={filterableColumns}>
      {({ filteredData, hasActiveItems, filters, onFilterChange, onClearAll }) => (
        <>
          {/* Mobile Filter Controls */}
          <ProductFilters
            filters={filters}
            onFilterChange={onFilterChange}
            onClearAll={onClearAll}
            variant="mobile"
          />

          {/* Results Summary and Bulk Actions */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                {filteredData.length} de {totalCount} productos
                {hasActiveItems && <span className="text-primary"> (filtrados)</span>}
              </small>

              {hasSelection && onBulkDelete && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={onBulkDelete}
                  disabled={deleting}
                >
                  <i className="mdi mdi-delete me-1"></i>
                  Eliminar ({selectedCount})
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <Row>
            {filteredData.length > 0 ? (
              filteredData.map(product => (
                <Col xs={12} sm={6} lg={4} key={product.id} className="mb-3">
                  <ProductCard
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isSelected={selectedItems.includes(product.id)}
                    onSelect={selectItem}
                    isDeleting={deleting}
                    isUpdating={updating}
                  />
                </Col>
              ))
            ) : (
              renderEmptyState(hasActiveItems)
            )}
          </Row>
        </>
      )}
    </FilterSummary>
  );
};

ProductGrid.propTypes = {
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

ProductGrid.defaultProps = {
  loading: false,
  updating: false,
  deleting: false,
  hasSelection: false,
  selectedCount: 0
};

export default ProductGrid;