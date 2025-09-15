import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

/**
 * Componente reutilizable para mostrar un resumen de filtros y ordenamientos activos
 * Basado en el diseño de UserCardsViewSimple (líneas 39-48)
 */
const FilterSummary = ({
  filters = {},
  sorting = { field: "", direction: "" },
  columns = [],
  onClearAll,
  className = "",
  showWhenEmpty = false
}) => {
  // Obtener filtros activos
  const activeFilters = Object.entries(filters).filter(([key, value]) =>
    value && value.trim() !== ""
  );

  // Verificar si hay ordenamiento activo
  const hasActiveSorting = sorting.field && sorting.direction;

  // Verificar si hay algún filtro o ordenamiento activo
  const hasActiveItems = activeFilters.length > 0 || hasActiveSorting;

  // Si no hay elementos activos y no se debe mostrar cuando está vacío, no renderizar
  if (!hasActiveItems && !showWhenEmpty) {
    return null;
  }

  // Función para obtener el nombre de la columna
  const getColumnName = (columnKey) => {
    const column = columns.find(col => col.key === columnKey);
    return column?.header || columnKey;
  };

  // Función para formatear el valor del filtro
  const formatFilterValue = (columnKey, value) => {
    const column = columns.find(col => col.key === columnKey);

    // Para filtros de tipo select con opciones booleanas
    if (column?.filterType === "select" &&
        column?.filterOptions?.includes("Sí") &&
        column?.filterOptions?.includes("No")) {
      return value;
    }

    // Para otros tipos de filtros, mostrar el valor entre comillas
    return `"${value}"`;
  };

  // Función para formatear la dirección del ordenamiento
  const formatSortDirection = (direction) => {
    return direction === 'asc' ? 'Ascendente' : 'Descendente';
  };

  return (
    <div className={`d-flex align-items-center justify-content-between p-3 bg-light border-bottom ${className}`}>
      <div className="d-flex flex-wrap align-items-center gap-2">
        {/* Mostrar filtros activos */}
        {activeFilters.length > 0 && (
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="text-muted small fw-medium">Filtros:</span>
            {activeFilters.map(([columnKey, value]) => (
              <span
                key={columnKey}
                className="badge bg-primary-subtle text-primary border border-primary-subtle"
              >
                {getColumnName(columnKey)}: {formatFilterValue(columnKey, value)}
              </span>
            ))}
          </div>
        )}

        {/* Separador si hay tanto filtros como ordenamiento */}
        {activeFilters.length > 0 && hasActiveSorting && (
          <span className="text-muted">•</span>
        )}

        {/* Mostrar ordenamiento activo */}
        {hasActiveSorting && (
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small fw-medium">Ordenado por:</span>
            <span className="badge bg-info-subtle text-info border border-info-subtle">
              {getColumnName(sorting.field)} ({formatSortDirection(sorting.direction)})
            </span>
          </div>
        )}

        {/* Mensaje cuando no hay filtros ni ordenamiento activos */}
        {!hasActiveItems && showWhenEmpty && (
          <span className="text-muted small">No hay filtros ni ordenamientos activos</span>
        )}
      </div>

      {/* Botón para limpiar todo */}
      {hasActiveItems && onClearAll && (
        <Button
          color="primary"
          outline
          onClick={onClearAll}
          className="d-inline-flex align-items-center"
          size="sm"
        >
          <i className="mdi mdi-filter-remove me-2"></i>
          Limpiar todo
        </Button>
      )}
    </div>
  );
};

FilterSummary.propTypes = {
  // Filtros activos (objeto con clave-valor)
  filters: PropTypes.object,

  // Configuración de ordenamiento
  sorting: PropTypes.shape({
    field: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc', ''])
  }),

  // Configuración de columnas para obtener nombres y tipos
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    header: PropTypes.string,
    filterType: PropTypes.string,
    filterOptions: PropTypes.array
  })),

  // Callback para limpiar todos los filtros y ordenamientos
  onClearAll: PropTypes.func,

  // Clase CSS adicional
  className: PropTypes.string,

  // Mostrar el componente incluso cuando no hay filtros activos
  showWhenEmpty: PropTypes.bool
};

export default FilterSummary;