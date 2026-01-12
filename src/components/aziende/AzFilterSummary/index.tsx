import React, { useState, useMemo, useCallback } from 'react';
import { Button, CardBody } from 'reactstrap';

// Interfaces TypeScript
interface FilterSummaryProps {
  data?: any[];
  columns?: any[];
  children?: React.ReactNode | ((props: any) => React.ReactNode);
  className?: string;
  showCount?: "auto" | "always" | "never";
  countPosition?: "top" | "bottom" | "both";
  alwaysVisible?: boolean;
  compact?: boolean;
}

/**
 * FilterSummary - Container component que gestiona filtros y ordenamientos
 * Utiliza render props pattern para pasar datos filtrados a componentes hijos
 */
const FilterSummary: React.FC<FilterSummaryProps> = ({
  data = [],
  columns = [],
  children,
  className = "",
  showCount = "auto", // "always", "never", "auto" (solo cuando hay filtros)
  countPosition = "top", // "top", "bottom", "both"
  alwaysVisible = false, // true = always show filter summary, false = only when filters are active
  compact = false // Modo compacto para reducir espacio vertical
}) => {

  // Validación y warning para desarrolladores
  if (!Array.isArray(data)) {
    console.error('AzFilterSummary: La prop "data" debe ser una lista/array. Recibido:', typeof data);
  }
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
          compact={compact}
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
  filteredData = [],
  compact = false
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
    return direction === 'asc' ? 'Asc' : 'Desc';
  };

  const hasFiltersOrSorting = activeFilters.length > 0 || hasActiveSorting;

  return (
    <div className={`d-flex align-items-center justify-content-between ${compact ? 'px-2 py-1' : 'p-2'} bg-light border-bottom ${className}`}>
      <div className={`d-flex flex-wrap align-items-center ${compact ? 'gap-1' : 'gap-2'}`}>
        {/* Conteo */}
        {alwaysVisible && (
          <span className={`text-muted ${compact ? 'font-size-11' : 'small'}`}>
            <strong className={hasFiltersOrSorting ? "text-primary" : ""}>{filteredData.length}</strong>/{data.length}
          </span>
        )}

        {/* Separador si hay conteo y filtros/ordenamiento */}
        {alwaysVisible && hasFiltersOrSorting && (
          <span className="text-muted">•</span>
        )}

        {/* Mostrar filtros activos */}
        {activeFilters.length > 0 && (
          <div className={`d-flex flex-wrap align-items-center ${compact ? 'gap-1' : 'gap-2'}`}>
            {!compact && <span className="text-muted small fw-medium">Filtros:</span>}
            {activeFilters.map(([columnKey, value]) => (
              <span
                key={columnKey}
                className={`badge bg-primary-subtle text-primary border border-primary-subtle ${compact ? 'font-size-10 py-0 px-1' : ''}`}
              >
                {compact ? value : `${getColumnName(columnKey)}: ${formatFilterValue(columnKey, value)}`}
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
          <div className={`d-flex align-items-center ${compact ? 'gap-1' : 'gap-2'}`}>
            {!compact && <span className="text-muted small fw-medium">Ordenado por:</span>}
            <span className={`badge bg-info-subtle text-info border border-info-subtle ${compact ? 'font-size-10 py-0 px-1' : ''}`}>
              {compact
                ? `${getColumnName(sorting.field)} ${formatSortDirection(sorting.direction)}`
                : `${getColumnName(sorting.field)} (${formatSortDirection(sorting.direction)})`
              }
            </span>
          </div>
        )}

        {/* Mostrar mensaje cuando alwaysVisible es true pero no hay filtros */}
        {alwaysVisible && !hasFiltersOrSorting && (
          <span className={`text-muted ${compact ? 'font-size-11' : 'small'}`}>Sin filtros</span>
        )}
      </div>

      {/* Botón para limpiar todo */}
      <Button
        color="primary"
        outline
        onClick={onClearAll}
        className={`d-inline-flex align-items-center ${compact ? 'py-0 px-2' : ''}`}
        size="sm"
        disabled={!hasFiltersOrSorting}
      >
        <i className={`mdi mdi-filter-remove ${compact ? '' : 'me-1'}`}></i>
        {!compact && <span className="d-none d-sm-inline">Limpiar</span>}
      </Button>
    </div>
  );
};

export default FilterSummary;
