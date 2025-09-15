import React from "react";
import PropTypes from "prop-types";
import { ButtonGroup, Button, Input } from "reactstrap";

const PaginationControls = ({
  pagination,
  onPrevPage,
  onNextPage,
  onChangeItemsPerPage,
  loading = false
}) => {
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    onChangeItemsPerPage(newItemsPerPage);
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <span className="text-muted small">Elementos por página:</span>

      <Input
        type="select"
        size="sm"
        style={{ width: '80px' }}
        value={pagination.itemsPerPage}
        onChange={handleItemsPerPageChange}
        disabled={loading}
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </Input>

      <ButtonGroup size="sm">
        <Button
          outline
          onClick={onPrevPage}
          disabled={!pagination.hasPrevPage || loading}
          title="Página anterior"
        >
          <i className="mdi mdi-chevron-left"></i>
        </Button>
        <Button
          outline
          onClick={onNextPage}
          disabled={!pagination.hasNextPage || loading}
          title="Página siguiente"
        >
          <i className="mdi mdi-chevron-right"></i>
        </Button>
      </ButtonGroup>
    </div>
  );
};

PaginationControls.propTypes = {
  pagination: PropTypes.shape({
    itemsPerPage: PropTypes.number.isRequired,
    hasPrevPage: PropTypes.bool.isRequired,
    hasNextPage: PropTypes.bool.isRequired
  }).isRequired,
  onPrevPage: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
  onChangeItemsPerPage: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default PaginationControls;