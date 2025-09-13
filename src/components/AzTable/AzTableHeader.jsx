import React from "react";
import PropTypes from "prop-types";
import { Input, Button } from "reactstrap";

const AzTableHeader = ({
  column,
  title,
  sortable = false,
  filterable = false,
  sorting = { field: "", direction: "" },
  filters = {},
  onSort,
  onFilter
}) => {
  const currentSortDirection = sorting.field === column ? sorting.direction : "";
  const currentFilter = filters[column] || "";

  const handleSort = () => {
    if (!sortable || !onSort) return;

    let newDirection = "asc";
    if (currentSortDirection === "asc") {
      newDirection = "desc";
    } else if (currentSortDirection === "desc") {
      newDirection = "";
    }

    onSort({
      field: newDirection ? column : "",
      direction: newDirection
    });
  };

  const handleFilter = (e) => {
    if (!filterable || !onFilter) return;
    onFilter(column, e.target.value);
  };

  const getSortIcon = () => {
    if (!sortable) return null;

    if (currentSortDirection === "asc") {
      return <i className="mdi mdi-arrow-up text-primary ms-1"></i>;
    } else if (currentSortDirection === "desc") {
      return <i className="mdi mdi-arrow-down text-primary ms-1"></i>;
    }
    return <i className="mdi mdi-unfold-more-horizontal text-muted ms-1"></i>;
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between fw-medium">
        <span
          className={`${sortable ? 'cursor-pointer user-select-none' : ''}`}
          onClick={handleSort}
          style={{
            cursor: sortable ? 'pointer' : 'default',
            userSelect: 'none'
          }}
        >
          {title}
          {getSortIcon()}
        </span>
      </div>
      {filterable && (
        <div className="column-filter-container" style={{ marginTop: '8px' }}>
          <Input
            type="text"
            size="sm"
            placeholder={`Filtrar ${title}...`}
            value={currentFilter}
            onChange={handleFilter}
            style={{ fontSize: '12px', height: '30px' }}
          />
        </div>
      )}
      {!filterable && (
        <div className="column-filter-container" style={{ marginTop: '8px' }}>
          <div style={{ height: '30px' }}></div>
        </div>
      )}
    </div>
  );
};

AzTableHeader.propTypes = {
  column: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  sortable: PropTypes.bool,
  filterable: PropTypes.bool,
  sorting: PropTypes.shape({
    field: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc', ''])
  }),
  filters: PropTypes.object,
  onSort: PropTypes.func,
  onFilter: PropTypes.func
};

export default AzTableHeader;