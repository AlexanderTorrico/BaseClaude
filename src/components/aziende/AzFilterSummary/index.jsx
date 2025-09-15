import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, CardBody } from 'reactstrap';

/**
 * FilterSummary - Container component que gestiona filtros y ordenamientos
 * Utiliza render props pattern para pasar datos filtrados a componentes hijos
 */
const FilterSummary = ({
  data = [],
  columns = [],
  children,
  className = "",
  showCount = "auto", // "always", "never", "auto" (solo cuando hay filtros)
  countPosition = "top", // "top", "bottom", "both"
  alwaysVisible = false // true = always show filter summary, false = only when filters are active
}) => {
  // Estados internos para filtros y ordenamiento
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState({ field: "", direction: "" });

  // Función para manejar cambios en filtros
  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  }, []);

  // Función para manejar cambios en ordenamiento
  const handleSortChange = useCallback((sortConfig) => {
    setSorting(sortConfig);
  }, []);

  // Función para limpiar todos los filtros y ordenamientos
  const handleClearAll = useCallback(() => {
    setFilters({});
    setSorting({ field: "", direction: "" });
  }, []);

  // Procesar datos con filtros y ordenamiento aplicados
  const filteredData = useMemo(() => {
    let result = [...data];

    // Aplicar filtros
    Object.entries(filters).forEach(([filterKey, filterValue]) => {
      if (filterValue && filterValue.trim() !== "") {
        // Encontrar la configuración de la columna para determinar el tipo de filtro
        const columnConfig = columns.find(col => col.key === filterKey);

        result = result.filter(row => {
          const cellValue = row[filterKey];
          if (cellValue == null) return false;

          // Manejar filtros de tipo select (exactos)
          if (columnConfig && columnConfig.filterType === "select") {
            // Para filtros booleanos especiales (Sí/No)
            if (columnConfig.filterOptions &&
                columnConfig.filterOptions.includes("Sí") &&
                columnConfig.filterOptions.includes("No")) {
              // Convertir valores booleanos a texto para comparar
              const booleanText = cellValue === true ? "Sí" : cellValue === false ? "No" : cellValue.toString();
              return booleanText === filterValue;
            }

            // Para otros filtros de select, usar comparación exacta
            return cellValue.toString() === filterValue;
          }

          // Filtro de texto normal (para filtros tipo text)
          return cellValue.toString().toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });

    // Aplicar ordenamiento
    if (sorting.field && sorting.direction) {
      result.sort((a, b) => {
        const aValue = a[sorting.field];
        const bValue = b[sorting.field];

        // Manejar valores nulos
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        // Comparar valores
        let comparison = 0;
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = aValue.toString().localeCompare(bValue.toString());
        }

        return sorting.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, filters, sorting, columns]);

  // Verificar si hay filtros o ordenamientos activos
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(filter => filter && filter.trim() !== "");
  }, [filters]);

  const hasActiveSorting = useMemo(() => {
    return sorting.field && sorting.direction;
  }, [sorting]);

  const hasActiveItems = hasActiveFilters || hasActiveSorting;

  // Determinar si mostrar el conteo
  const shouldShowCount = useMemo(() => {
    switch (showCount) {
      case "always":
        return true;
      case "never":
        return false;
      case "auto":
      default:
        return hasActiveItems || filteredData.length !== data.length;
    }
  }, [showCount, hasActiveItems, filteredData.length, data.length]);

  // Componente para mostrar el conteo
  const CountDisplay = ({ className: countClassName = "" }) => {
    if (!shouldShowCount) return null;

    const isFiltered = filteredData.length !== data.length;

    return (
      <div className={`d-flex justify-content-between align-items-center ${countClassName}`}>
        <small className="text-muted">
          {isFiltered ? (
            <>
              <strong className="text-primary">{filteredData.length}</strong>
              <span>/</span>
              <strong>{data.length}</strong>
              <span> elementos</span>
            </>
          ) : (
            <>
              <strong>{data.length}</strong>
              <span> elementos</span>
            </>
          )}
        </small>
      </div>
    );
  };

  // Props que se pasan al componente hijo
  const renderProps = {
    // Datos filtrados y procesados
    filteredData,
    originalData: data,

    // Estados actuales
    filters,
    sorting,

    // Funciones para manejar cambios
    onFilterChange: handleFilterChange,
    onSortChange: handleSortChange,
    onClearAll: handleClearAll,

    // Información adicional
    hasActiveFilters,
    hasActiveSorting,
    hasActiveItems,
    columns
  };

  return (
    <CardBody className="p-0">
      {/* Conteo superior */}
      {(countPosition === "top" || countPosition === "both") && (
        <CountDisplay className="mb-0" />
      )}

      {/* Mostrar resumen de filtros si hay elementos activos o si alwaysVisible está habilitado */}
      {(hasActiveItems || alwaysVisible) && (
        <FilterSummaryDisplay
          filters={filters}
          sorting={sorting}
          columns={columns}
          onClearAll={handleClearAll}
          className={`mb-0 ${className}`}
          alwaysVisible={alwaysVisible}
          data={data}
          filteredData={filteredData}
        />
      )}

      {/* Renderizar componente hijo con render props */}
      {typeof children === 'function' ? children(renderProps) : children}

      {/* Conteo inferior */}
      {(countPosition === "bottom" || countPosition === "both") && (
        <CountDisplay className="mt-0" />
      )}
    </CardBody>
  );
};

/**
 * Componente interno para mostrar el resumen de filtros
 */
const FilterSummaryDisplay = ({
  filters,
  sorting,
  columns,
  onClearAll,
  className,
  alwaysVisible = false,
  data = [],
  filteredData = []
}) => {
  // Obtener filtros activos
  const activeFilters = Object.entries(filters).filter(([key, value]) =>
    value && value.trim() !== ""
  );

  // Verificar si hay ordenamiento activo
  const hasActiveSorting = sorting.field && sorting.direction;

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
    <div className={`d-flex align-items-center justify-content-between p-2 bg-light border-bottom ${className}`}>
      <div className="d-flex flex-column gap-2">
        {/* Primera fila: Filtros y ordenamiento */}
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

          {/* Mostrar mensaje cuando alwaysVisible es true pero no hay filtros */}
          {alwaysVisible && activeFilters.length === 0 && !hasActiveSorting && (
            <span className="text-muted small">Sin filtros aplicados</span>
          )}
        </div>

        {/* Segunda fila: Conteo (siempre al final) */}
        {alwaysVisible && (
          <div className="text-muted small">
            Total <strong className={activeFilters.length > 0 || hasActiveSorting ? "text-primary" : ""}>{filteredData.length}</strong>/<strong>{data.length}</strong>
          </div>
        )}
      </div>

      {/* Botón para limpiar todo */}
      <Button
        color="primary"
        outline
        onClick={onClearAll}
        className="d-inline-flex align-items-center"
        size="sm"
        disabled={activeFilters.length === 0 && !hasActiveSorting}
      >
        <i className="mdi mdi-filter-remove me-2"></i>
        Limpiar todo
      </Button>
    </div>
  );
};

FilterSummary.propTypes = {
  // Datos originales a filtrar
  data: PropTypes.array.isRequired,

  // Configuración de columnas
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    header: PropTypes.string,
    filterType: PropTypes.oneOf(['text', 'select']),
    filterOptions: PropTypes.array
  })).isRequired,

  // Render props function
  children: PropTypes.func.isRequired,

  // Clase CSS adicional para el summary
  className: PropTypes.string,

  // Control de visualización del conteo: "always", "never", "auto"
  showCount: PropTypes.oneOf(['always', 'never', 'auto']),

  // Posición del conteo: "top", "bottom", "both"
  countPosition: PropTypes.oneOf(['top', 'bottom', 'both']),

  // Si true, siempre muestra el summary de filtros, incluso sin filtros activos
  alwaysVisible: PropTypes.bool
};

FilterSummaryDisplay.propTypes = {
  filters: PropTypes.object.isRequired,
  sorting: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  onClearAll: PropTypes.func.isRequired,
  className: PropTypes.string,
  alwaysVisible: PropTypes.bool,
  data: PropTypes.array,
  filteredData: PropTypes.array
};

export default FilterSummary;