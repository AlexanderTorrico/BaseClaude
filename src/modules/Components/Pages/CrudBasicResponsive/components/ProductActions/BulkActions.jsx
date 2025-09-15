import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

const BulkActions = ({
  hasSelection,
  selectedCount,
  onBulkDelete,
  onClearSelection,
  isDeleting = false
}) => {
  if (!hasSelection) {
    return null;
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <Button
        color="danger"
        size="sm"
        onClick={onBulkDelete}
        disabled={isDeleting}
      >
        <i className="mdi mdi-delete me-1"></i>
        Eliminar ({selectedCount})
      </Button>

      <Button
        color="outline-secondary"
        size="sm"
        onClick={onClearSelection}
        disabled={isDeleting}
      >
        <i className="mdi mdi-close me-1"></i>
        Limpiar selección
      </Button>
    </div>
  );
};

BulkActions.propTypes = {
  hasSelection: PropTypes.bool.isRequired,
  selectedCount: PropTypes.number.isRequired,
  onBulkDelete: PropTypes.func.isRequired,
  onClearSelection: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool
};

export default BulkActions;