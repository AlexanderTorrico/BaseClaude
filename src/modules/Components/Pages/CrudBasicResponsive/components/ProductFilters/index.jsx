import React from "react";
import PropTypes from "prop-types";
import DesktopFilters from "./DesktopFilters";
import MobileFilters from "./MobileFilters";

const ProductFilters = ({
  filters,
  sorting,
  onFilterChange,
  onSortChange,
  onClearAll,
  variant = "desktop"
}) => {
  if (variant === "mobile") {
    return (
      <MobileFilters
        filters={filters}
        onFilterChange={onFilterChange}
        onClearAll={onClearAll}
      />
    );
  }

  return (
    <DesktopFilters
      filters={filters}
      sorting={sorting}
      onFilterChange={onFilterChange}
      onSortChange={onSortChange}
      onClearAll={onClearAll}
    />
  );
};

ProductFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  sorting: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func,
  onClearAll: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["desktop", "mobile"])
};

ProductFilters.defaultProps = {
  variant: "desktop",
  sorting: {}
};

export default ProductFilters;