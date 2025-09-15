import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

/**
 * FilterSummary - Container component que gestiona filtros y ordenamientos
 * Utiliza render props pattern para pasar datos filtrados a componentes hijos
 */
const FilterSummary = ({
  data = [],
  columns = [],
  children,
  className = ""
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
    <>
      {/* Mostrar resumen de filtros si hay elementos activos */}
      {hasActiveItems && (
        <FilterSummaryDisplay
          filters={filters}
          sorting={sorting}
          columns={columns}
          onClearAll={handleClearAll}
          className={className}
        />
      )}

      {/* Renderizar componente hijo con render props */}
      {typeof children === 'function' ? children(renderProps) : children}
    </>
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
  className
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
      </div>

      {/* Botón para limpiar todo */}
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
  className: PropTypes.string
};

FilterSummaryDisplay.propTypes = {
  filters: PropTypes.object.isRequired,
  sorting: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  onClearAll: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default FilterSummary;