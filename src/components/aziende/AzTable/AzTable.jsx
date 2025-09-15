import React, { useMemo, useState, Children, useCallback } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import TableContainer from "./TableContainer";
import FilterSummary from "../FilterSummary";

/**
 * AzTable - Componente genérico de tabla con funcionalidades avanzadas
 */
const AzTable = ({
  data = [],
  columns = [],
  selectedItems = [],
  onSelectedChange,
  pagination = true,
  sorting = { field: "", direction: "" },
  onSortChange,
  filters = {},
  onFilterChange,
  className = "",
  tableProps = {},
  children,
  showActions = false,
  components,
  showFilterSummary = false
}) => {
  const { t } = useTranslation();

  // Estado interno para filtros y ordenamiento
  const [internalFilters, setInternalFilters] = useState(filters || {});
  const [internalSorting, setInternalSorting] = useState(sorting || { field: "", direction: "" });

  // Memoizar selectedItems para evitar re-renders innecesarios
  const currentSelectedItems = useMemo(() => selectedItems || [], [selectedItems]);

  const handleSelectionChange = (newSelectedItems) => {
    if (onSelectedChange) {
      onSelectedChange(newSelectedItems);
    }
  };

  // Función para manejar filtros internos
  const handleInternalFilter = useCallback((column, value) => {
    const newFilters = {
      ...internalFilters,
      [column]: value
    };
    setInternalFilters(newFilters);

    // Si hay callback externo, notificar
    if (onFilterChange) {
      onFilterChange(column, value);
    }
  }, [internalFilters, onFilterChange]);

  // Función para manejar ordenamiento interno
  const handleInternalSort = useCallback((sortConfig) => {
    setInternalSorting(sortConfig);

    // Si hay callback externo, notificar
    if (onSortChange) {
      onSortChange(sortConfig);
    }
  }, [onSortChange]);

  // Función para limpiar todos los filtros y ordenamientos
  const handleClearAll = useCallback(() => {
    const clearedFilters = {};
    const clearedSorting = { field: "", direction: "" };

    setInternalFilters(clearedFilters);
    setInternalSorting(clearedSorting);

    // Notificar cambios externos
    if (onFilterChange) {
      // Limpiar todos los filtros
      Object.keys(internalFilters).forEach(column => {
        onFilterChange(column, "");
      });
    }

    if (onSortChange) {
      onSortChange(clearedSorting);
    }
  }, [internalFilters, onFilterChange, onSortChange]);

  // Procesar datos con filtros y ordenamiento aplicados
  const processedData = useMemo(() => {
    let filteredData = [...data];

    // Aplicar filtros
    Object.entries(internalFilters).forEach(([column, filterValue]) => {
      if (filterValue && filterValue.trim() !== "") {
        // Encontrar la configuración de la columna para determinar el tipo de filtro
        const columnConfig = columns.find(col => col.key === column);

        filteredData = filteredData.filter(row => {
          const cellValue = row[column];
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
    if (internalSorting.field && internalSorting.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[internalSorting.field];
        const bValue = b[internalSorting.field];

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

        return internalSorting.direction === 'asc' ? comparison : -comparison;
      });
    }

    return filteredData;
  }, [data, internalFilters, internalSorting, columns]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return Object.values(internalFilters).some(filter => filter && filter.trim() !== "");
  }, [internalFilters]);

  // Datos procesados con fila de "sin datos" si es necesario
  const finalData = useMemo(() => {
    if (processedData.length === 0) {
      // Crear una fila especial para "sin datos"
      return [{
        __isNoDataRow: true,
        __noDataMessage: hasActiveFilters ? t("No results match your filters") : t("No data found"),
        __noDataSubtitle: hasActiveFilters ? t("Try adjusting your search criteria") : null
      }];
    }
    return processedData;
  }, [processedData, hasActiveFilters, t]);

  const actionColumn = useMemo(() => {
    // Si se proporciona un children de tipo AzTableActions, usarlo
    const actionsChild = Children.toArray(children).find(
      child => child.type?.displayName === 'AzTableActions'
    );

    if (actionsChild) {
      return {
        header: (
          <div>
            <div className="d-flex align-items-center justify-content-center fw-medium">
              <span>Acciones</span>
            </div>
            <div className="column-filter-container" style={{ marginTop: '8px' }}>
              <div style={{ height: '30px' }}></div>
            </div>
          </div>
        ),
        accessorKey: "actions",
        enableSorting: false,
        enableColumnFilter: false,
        getCanFilter: () => false,
        cell: ({ row }) => {
          // No mostrar acciones para la fila de "sin datos"
          if (row.original.__isNoDataRow) {
            return null;
          }
          const actionsProps = {
            row: row.original,
            index: row.index,
            isSelected: currentSelectedItems.includes(row.original.id),
            ...actionsChild.props
          };
          return React.cloneElement(actionsChild, actionsProps);
        }
      };
    }

    // Si showActions es true y hay components, renderizar los components
    if (showActions && components) {
      return {
        header: (
          <div>
            <div className="d-flex align-items-center justify-content-center fw-medium">
              <span>Acciones</span>
            </div>
            <div className="column-filter-container" style={{ marginTop: '8px' }}>
              <div style={{ height: '30px' }}></div>
            </div>
          </div>
        ),
        accessorKey: "actions",
        enableSorting: false,
        enableColumnFilter: false,
        getCanFilter: () => false,
        cell: ({ row }) => {
          // No mostrar acciones para la fila de "sin datos"
          if (row.original.__isNoDataRow) {
            return null;
          }
          return (
            <div className="d-flex gap-2 py-2 justify-content-center">
              {React.Children.map(components, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, {
                    ...child.props,
                    'data-row': JSON.stringify(row.original),
                    'data-index': row.index,
                  });
                }
                return child;
              })}
            </div>
          );
        }
      };
    }

    return null;
  }, [children, currentSelectedItems, showActions, components]);

  const processedColumns = useMemo(() => {
    let finalColumns = [];

    // Add selection column if onSelectedChange is provided
    if (onSelectedChange) {
      const selectionColumn = {
        header: (
          <div>
            <div className="d-flex align-items-center justify-content-center">
              <Input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    const realData = finalData.filter(item => !item.__isNoDataRow);
                    handleSelectionChange(realData.map(item => item.id));
                  } else {
                    handleSelectionChange([]);
                  }
                }}
                checked={finalData.filter(item => !item.__isNoDataRow).length > 0 && currentSelectedItems.length === finalData.filter(item => !item.__isNoDataRow).length}
                indeterminate={currentSelectedItems.length > 0 && currentSelectedItems.length < finalData.filter(item => !item.__isNoDataRow).length}
              />
            </div>
            <div className="column-filter-container" style={{ marginTop: '8px' }}>
              <div style={{ height: '30px' }}></div>
            </div>
          </div>
        ),
        accessorKey: "select",
        enableSorting: false,
        enableColumnFilter: false,
        getCanFilter: () => false,
        cell: ({ row }) => {
          // No mostrar checkbox para la fila de "sin datos"
          if (row.original.__isNoDataRow) {
            return null;
          }
          return (
            <Input
              type="checkbox"
              checked={currentSelectedItems.includes(row.original.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  handleSelectionChange([...currentSelectedItems, row.original.id]);
                } else {
                  handleSelectionChange(currentSelectedItems.filter(id => id !== row.original.id));
                }
              }}
            />
          );
        },
      };
      finalColumns.push(selectionColumn);
    }

    // Process user-defined columns
    const processedUserColumns = columns.map((column) => {
      const processedColumn = {
        accessorKey: column.key,
        enableSorting: false,
        enableColumnFilter: false,
        ...column
      };

      // Disable TanStack Table's built-in filtering for all columns
      processedColumn.getCanFilter = () => false;

      // Create header with sorting and filtering
      if (column.header || column.sortable || column.filterable) {
        processedColumn.header = (
          <AzTableHeader
            column={column.key}
            title={column.header || column.key}
            sortable={column.sortable}
            filterable={column.filterable}
            sorting={internalSorting}
            filters={internalFilters}
            onSort={handleInternalSort}
            onFilter={handleInternalFilter}
            filterType={column.filterType || "text"}
            filterOptions={column.filterOptions || []}
          />
        );
      }

      // Override cell rendering for "no data" row
      const originalCell = processedColumn.cell;
      processedColumn.cell = ({ row }) => {
        // Para datos normales, usar el cell original
        if (!row.original.__isNoDataRow) {
          if (originalCell) {
            return originalCell({ row, getValue: () => row.original[column.key] });
          }
          return row.original[column.key];
        }

        // Para fila de "sin datos", retornar null para todas las columnas
        // El manejo se hará a nivel de fila en TableContainer
        return null;
      };

      return processedColumn;
    });

    finalColumns = [...finalColumns, ...processedUserColumns];

    // Add actions column if exists
    if (actionColumn) {
      finalColumns.push(actionColumn);
    }

    return finalColumns;
  }, [columns, finalData, currentSelectedItems, onSelectedChange, actionColumn, internalSorting, internalFilters, handleInternalSort, handleInternalFilter, handleSelectionChange]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card className={`border-0 shadow-sm ${className}`}>
            <CardBody className="p-4">
              {/* Mostrar resumen de filtros si está habilitado */}
              {showFilterSummary && (
                <FilterSummary
                  filters={internalFilters}
                  sorting={internalSorting}
                  columns={columns}
                  onClearAll={handleClearAll}
                  className="mb-3"
                />
              )}
              <div className="table-responsive az-table-container">
                <style>{`
                  .az-table-container .table.dataTable.dtr-inline.collapsed > tbody > tr > td.dtr-control:before,
                  .az-table-container .table.dataTable tbody td.dtr-control:before {
                    display: none !important;
                  }
                  .az-table-container .table.dataTable.dtr-inline.collapsed > tbody > tr > td.dtr-control,
                  .az-table-container .table.dataTable tbody td.dtr-control {
                    padding-left: 8px !important;
                  }
                  .az-table-container input[type="text"]::-webkit-outer-spin-button,
                  .az-table-container input[type="text"]::-webkit-inner-spin-button,
                  .az-table-container input[type="number"]::-webkit-outer-spin-button,
                  .az-table-container input[type="number"]::-webkit-inner-spin-button {
                    -webkit-appearance: none !important;
                    margin: 0 !important;
                  }
                  .az-table-container input[type="text"],
                  .az-table-container input[type="number"] {
                    -moz-appearance: textfield !important;
                  }
                `}</style>
                <TableContainer
                  columns={processedColumns}
                  data={finalData}
                  isGlobalFilter={false}
                  isPagination={pagination}
                  isCustomPageSize={false}
                  SearchPlaceholder="Filtrar..."
                  divClassName="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap table-striped"
                  theadClass="table-light text-muted"
                  paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded mt-3"
                  pagination="pagination"
                  {...tableProps}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente de header con ordenamiento y filtrado
 */
const AzTableHeader = ({
  column,
  title,
  sortable = false,
  filterable = false,
  sorting = { field: "", direction: "" },
  filters = {},
  onSort,
  onFilter,
  filterType = "text",
  filterOptions = []
}) => {
  const currentSortDirection = sorting.field === column ? sorting.direction : "";
  const currentFilter = filters[column] || "";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  // Cerrar dropdown al hacer click fuera
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


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
      return <i className="mdi mdi-arrow-up text-primary"></i>;
    } else if (currentSortDirection === "desc") {
      return <i className="mdi mdi-arrow-down text-primary"></i>;
    }
    return <i className="mdi mdi-unfold-more-horizontal text-muted"></i>;
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
        </span>
        {sortable && (
          <span
            className="cursor-pointer user-select-none"
            onClick={handleSort}
            style={{
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            {getSortIcon()}
          </span>
        )}
      </div>
      {filterable && (
        <div className="column-filter-container" style={{ marginTop: '8px' }}>
          {filterType === "select" ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  fontSize: '12px',
                  height: '30px',
                  border: '1px solid #e3ebf6',
                  borderRadius: '4px',
                  outline: 'none',
                  transition: 'all 0.15s ease-in-out',
                  backgroundColor: '#ffffff',
                  color: '#495057',
                  backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3e%3cpath fill=\'none\' stroke=\'%23343a40\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M2 5l6 6 6-6\'/%3e%3c/svg%3e")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '16px 12px',
                  paddingRight: '2.25rem',
                  paddingLeft: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  borderColor: isOpen ? '#74b9ff' : '#e3ebf6',
                  boxShadow: isOpen ? '0 0 0 0.2rem rgba(116, 185, 255, 0.25)' : 'none',
                  fontWeight: 'normal'
                }}
                onMouseEnter={(e) => {
                  if (!isOpen) {
                    e.target.style.borderColor = '#74b9ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) {
                    e.target.style.borderColor = '#e3ebf6';
                  }
                }}
              >
                {currentFilter || "Todos"}
              </div>

              {isOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e3ebf6',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}
                >
                  <div
                    onClick={() => {
                      if (onFilter) onFilter(column, "");
                      setIsOpen(false);
                    }}
                    style={{
                      padding: '6px 8px',
                      fontSize: '12px',
                      color: !currentFilter ? '#ffffff' : '#495057',
                      cursor: 'pointer',
                      borderBottom: '1px solid #e3ebf6',
                      backgroundColor: !currentFilter ? '#74b9ff' : '#ffffff',
                      fontWeight: 'normal'
                    }}
                    onMouseEnter={(e) => {
                      if (currentFilter) {
                        e.target.style.backgroundColor = '#f8f9fa';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentFilter) {
                        e.target.style.backgroundColor = '#ffffff';
                      }
                    }}
                  >
                    Todos
                  </div>

                  {filterOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        if (onFilter) onFilter(column, option);
                        setIsOpen(false);
                      }}
                      style={{
                        padding: '6px 8px',
                        fontSize: '12px',
                        color: currentFilter === option ? '#ffffff' : '#495057',
                        cursor: 'pointer',
                        borderBottom: '1px solid #e3ebf6',
                        backgroundColor: currentFilter === option ? '#74b9ff' : '#ffffff',
                        fontWeight: 'normal'
                      }}
                      onMouseEnter={(e) => {
                        if (currentFilter !== option) {
                          e.target.style.backgroundColor = '#f8f9fa';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFilter !== option) {
                          e.target.style.backgroundColor = '#ffffff';
                        }
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Input
              type="text"
              bsSize="sm"
              placeholder={`Filtrar ${title}...`}
              value={currentFilter}
              onChange={handleFilter}
              style={{
                fontSize: '12px',
                height: '30px',
                border: '1px solid #e3ebf6',
                borderRadius: '4px',
                boxShadow: 'none',
                outline: 'none',
                transition: 'border-color 0.15s ease-in-out'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#74b9ff';
                e.target.style.boxShadow = '0 0 0 0.2rem rgba(116, 185, 255, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e3ebf6';
                e.target.style.boxShadow = 'none';
              }}
            />
          )}
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

/**
 * Componente de acciones personalizable
 */
const AzTableActions = ({ children, row, index, isSelected, ...props }) => {
  const processedChildren = Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ...child.props,
        'data-row': JSON.stringify(row),
        'data-index': index,
        'data-selected': isSelected,
        ...props
      });
    }
    return child;
  });

  return <div className="d-flex gap-2 py-2 justify-content-center">{processedChildren}</div>;
};

AzTableActions.displayName = 'AzTableActions';

// PropTypes
AzTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    header: PropTypes.string,
    sortable: PropTypes.bool,
    filterable: PropTypes.bool,
    cell: PropTypes.func,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })).isRequired,
  selectedItems: PropTypes.array,
  onSelectedChange: PropTypes.func,
  pagination: PropTypes.bool,
  sorting: PropTypes.shape({
    field: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc', ''])
  }),
  onSortChange: PropTypes.func,
  filters: PropTypes.object,
  onFilterChange: PropTypes.func,
  className: PropTypes.string,
  tableProps: PropTypes.object,
  children: PropTypes.node,
  showActions: PropTypes.bool,
  components: PropTypes.node,
  showFilterSummary: PropTypes.bool
};

AzTableActions.propTypes = {
  children: PropTypes.node,
  row: PropTypes.object,
  index: PropTypes.number,
  isSelected: PropTypes.bool
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
  onFilter: PropTypes.func,
  filterType: PropTypes.oneOf(['text', 'select']),
  filterOptions: PropTypes.array
};

// Asignar subcomponentes
AzTable.Actions = AzTableActions;

// También exportar AzTable directamente para uso interno
export { AzTable, AzTableActions };
export default AzTable;