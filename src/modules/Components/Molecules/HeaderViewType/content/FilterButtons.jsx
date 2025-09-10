import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

/**
 * FilterButtons - Componentes de filtros y controles reutilizables
 * Conjunto de botones optimizados para contentBottomRight de Headers
 */

// Botón de filtros principal
export const FilterButton = React.memo(({ 
  text = "Filtros", 
  icon = "mdi-filter", 
  color = "light", 
  outline = true,
  onClick,
  size = "sm",
  isActive = false
}) => (
  <Button 
    color={isActive ? "primary" : color} 
    outline={!isActive && outline} 
    size={size} 
    onClick={onClick}
  >
    <i className={`mdi ${icon}`}></i>
    <span className="d-none d-sm-inline ms-1">{text}</span>
  </Button>
));

FilterButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  outline: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  isActive: PropTypes.bool
};

// Botón de ordenamiento
export const SortButton = React.memo(({ 
  text = "Ordenar", 
  icon = "mdi-sort", 
  color = "secondary", 
  outline = true,
  onClick,
  size = "sm",
  sortDirection = null // 'asc', 'desc', null
}) => {
  const getSortIcon = React.useMemo(() => {
    switch (sortDirection) {
      case 'asc': return 'mdi-sort-ascending';
      case 'desc': return 'mdi-sort-descending';
      default: return icon;
    }
  }, [sortDirection, icon]);

  return (
    <Button 
      color={sortDirection ? "primary" : color} 
      outline={!sortDirection && outline} 
      size={size} 
      onClick={onClick}
    >
      <i className={`mdi ${getSortIcon}`}></i>
      <span className="d-none d-sm-inline ms-1">{text}</span>
    </Button>
  );
});

SortButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  outline: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  sortDirection: PropTypes.oneOf(['asc', 'desc', null])
};

// Botón de filtrar (acción específica)
export const FilterActionButton = React.memo(({ 
  text = "Filtrar", 
  icon = "mdi-filter", 
  color = "primary", 
  outline = true,
  onClick,
  size = "sm"
}) => (
  <Button color={color} outline={outline} size={size} onClick={onClick}>
    <i className={`mdi ${icon}`}></i>
    <span className="d-none d-sm-inline ms-1">{text}</span>
  </Button>
));

FilterActionButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  outline: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string
};

// Botón de limpiar filtros
export const ClearFiltersButton = React.memo(({ 
  text = "Limpiar", 
  icon = "mdi-filter-off", 
  color = "warning", 
  outline = true,
  onClick,
  size = "sm"
}) => (
  <Button color={color} outline={outline} size={size} onClick={onClick}>
    <i className={`mdi ${icon}`}></i>
    <span className="d-none d-sm-inline ms-1">{text}</span>
  </Button>
));

ClearFiltersButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  outline: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string
};

// Botón de vista/vista previa
export const ViewButton = React.memo(({ 
  text = "Vista", 
  icon = "mdi-eye", 
  color = "info", 
  outline = true,
  onClick,
  size = "sm"
}) => (
  <Button color={color} outline={outline} size={size} onClick={onClick}>
    <i className={`mdi ${icon}`}></i>
    <span className="d-none d-sm-inline ms-1">{text}</span>
  </Button>
));

ViewButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  outline: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string
};

// Grupo de botones de filtros y ordenamiento
export const FilterSortGroup = React.memo(({ 
  onFilter, 
  onSort, 
  onClear,
  hasActiveFilters = false,
  sortDirection = null
}) => (
  <div className="d-flex gap-2 align-items-center justify-content-sm-end">
    <FilterButton 
      onClick={onFilter}
      isActive={hasActiveFilters}
    />
    <SortButton 
      onClick={onSort}
      sortDirection={sortDirection}
    />
    {hasActiveFilters && (
      <ClearFiltersButton 
        onClick={onClear}
      />
    )}
  </div>
));

FilterSortGroup.propTypes = {
  onFilter: PropTypes.func,
  onSort: PropTypes.func,
  onClear: PropTypes.func,
  hasActiveFilters: PropTypes.bool,
  sortDirection: PropTypes.oneOf(['asc', 'desc', null])
};

// Grupo simple de filtro
export const SimpleFilterGroup = React.memo(({ onFilter }) => (
  <div className="d-flex gap-2 align-items-center justify-content-sm-end">
    <FilterActionButton onClick={onFilter} />
  </div>
));

SimpleFilterGroup.propTypes = {
  onFilter: PropTypes.func
};

// Botón personalizable para contentBottomRight
export const CustomRightButton = React.memo(({ 
  text, 
  icon, 
  color = "secondary", 
  outline = true,
  onClick,
  size = "sm",
  className = ""
}) => (
  <Button 
    color={color} 
    outline={outline} 
    size={size} 
    onClick={onClick}
    className={className}
  >
    {icon && <i className={`mdi ${icon}`}></i>}
    {text && <span className="d-none d-sm-inline ms-1">{text}</span>}
  </Button>
));

CustomRightButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  outline: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  className: PropTypes.string
};