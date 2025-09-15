import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import BulkActions from "./BulkActions";

const ProductActions = ({
  onCreate,
  onRefresh,
  onBulkDelete,
  onClearSelection,
  hasSelection,
  selectedCount,
  creating = false,
  loading = false,
  deleting = false
}) => {
  return (
    <div className="d-flex gap-2 align-items-center">
      {/* Primary Actions */}
      <Button
        color="success"
        onClick={onCreate}
        disabled={creating || loading}
      >
        <i className="mdi mdi-plus me-2"></i>
        Nuevo Producto
      </Button>

      <Button
        color="outline-primary"
        onClick={onRefresh}
        disabled={loading}
        title="Actualizar datos"
      >
        <i className="mdi mdi-refresh"></i>
      </Button>

      {/* Bulk Actions */}
      <BulkActions
        hasSelection={hasSelection}
        selectedCount={selectedCount}
        onBulkDelete={onBulkDelete}
        onClearSelection={onClearSelection}
        isDeleting={deleting}
      />
    </div>
  );
};

ProductActions.propTypes = {
  // Event handlers
  onCreate: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onBulkDelete: PropTypes.func.isRequired,
  onClearSelection: PropTypes.func.isRequired,

  // Selection state
  hasSelection: PropTypes.bool.isRequired,
  selectedCount: PropTypes.number.isRequired,

  // Loading states
  creating: PropTypes.bool,
  loading: PropTypes.bool,
  deleting: PropTypes.bool
};

export default ProductActions;