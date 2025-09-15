import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Input, Button } from "reactstrap";
import { getFilterOptions } from "../ProductTable/ProductTableColumns.jsx";

const MobileFilters = ({
  filters,
  onFilterChange,
  onClearAll
}) => {
  const { categories } = getFilterOptions();

  return (
    <div className="mb-4">
      <Row className="g-3">
        {/* Search input */}
        <Col xs={12}>
          <Input
            type="text"
            size="sm"
            placeholder="Buscar productos..."
            value={filters.name || ""}
            onChange={(e) => onFilterChange("name", e.target.value)}
          />
        </Col>

        {/* Category filter and clear button */}
        <Col xs={8}>
          <Input
            type="select"
            size="sm"
            value={filters.category || ""}
            onChange={(e) => onFilterChange("category", e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Input>
        </Col>

        <Col xs={4}>
          <Button
            color="outline-secondary"
            size="sm"
            onClick={onClearAll}
            className="w-100"
            title="Limpiar filtros"
          >
            <i className="mdi mdi-close"></i>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

MobileFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired
};

export default MobileFilters;