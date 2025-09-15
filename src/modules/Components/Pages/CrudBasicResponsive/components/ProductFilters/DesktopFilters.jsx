import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Input, ButtonGroup, Button } from "reactstrap";
import { getFilterOptions } from "../ProductTable/ProductTableColumns.jsx";

const DesktopFilters = ({
  filters,
  sorting,
  onFilterChange,
  onSortChange,
  onClearAll
}) => {
  const { categories, sortFields } = getFilterOptions();

  const handleSortFieldChange = (field) => {
    onSortChange({
      field,
      direction: sorting.direction || "asc"
    });
  };

  const handleSortDirectionChange = (direction) => {
    onSortChange({
      field: sorting.field || "",
      direction
    });
  };

  return (
    <div className="mb-4">
      <Row className="g-3 align-items-end">
        {/* Search by name */}
        <Col lg={3} md={6}>
          <label className="form-label small">Buscar producto</label>
          <Input
            type="text"
            size="sm"
            placeholder="Nombre del producto..."
            value={filters.name || ""}
            onChange={(e) => onFilterChange("name", e.target.value)}
          />
        </Col>

        {/* Category filter */}
        <Col lg={3} md={6}>
          <label className="form-label small">Categoría</label>
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

        {/* Sort field */}
        <Col lg={2} md={4}>
          <label className="form-label small">Ordenar por</label>
          <Input
            type="select"
            size="sm"
            value={sorting.field || ""}
            onChange={(e) => handleSortFieldChange(e.target.value)}
          >
            <option value="">Sin orden</option>
            {sortFields.map(field => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </Input>
        </Col>

        {/* Sort direction */}
        <Col lg={2} md={2}>
          <label className="form-label small">Dirección</label>
          <ButtonGroup size="sm" className="w-100">
            <Button
              color={sorting.direction === 'asc' ? 'primary' : 'outline-primary'}
              onClick={() => handleSortDirectionChange("asc")}
              disabled={!sorting.field}
              title="Ascendente"
            >
              <i className="mdi mdi-arrow-up"></i>
            </Button>
            <Button
              color={sorting.direction === 'desc' ? 'primary' : 'outline-primary'}
              onClick={() => handleSortDirectionChange("desc")}
              disabled={!sorting.field}
              title="Descendente"
            >
              <i className="mdi mdi-arrow-down"></i>
            </Button>
          </ButtonGroup>
        </Col>

        {/* Clear filters */}
        <Col lg={2} md={6}>
          <Button
            color="outline-secondary"
            size="sm"
            onClick={onClearAll}
            className="w-100"
            title="Limpiar todos los filtros"
          >
            <i className="mdi mdi-close me-1"></i>
            Limpiar
          </Button>
        </Col>
      </Row>
    </div>
  );
};

DesktopFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  sorting: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired
};

export default DesktopFilters;