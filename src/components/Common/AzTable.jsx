import React, { useMemo, useState, useEffect, Children, useCallback } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Input, Badge as BootstrapBadge, Button } from "reactstrap";
import { Link as RouterLink } from "react-router-dom";
import TableContainer from "./TableContainer";

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
  components
}) => {
  // Estado interno para filtros y ordenamiento
  const [internalFilters, setInternalFilters] = useState(filters || {});
  const [internalSorting, setInternalSorting] = useState(sorting || { field: "", direction: "" });

  // Usar directamente selectedItems sin estado interno para evitar loops
  const currentSelectedItems = selectedItems || [];

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

  // Procesar datos con filtros y ordenamiento aplicados
  const processedData = useMemo(() => {
    let filteredData = [...data];

    // Aplicar filtros
    Object.entries(internalFilters).forEach(([column, filterValue]) => {
      if (filterValue && filterValue.trim() !== "") {
        filteredData = filteredData.filter(row => {
          const cellValue = row[column];
          if (cellValue == null) return false;

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
  }, [data, internalFilters, internalSorting]);

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
        cell: ({ row }) => {
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
        cell: ({ row }) => (
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
        )
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
                    handleSelectionChange(processedData.map(item => item.id));
                  } else {
                    handleSelectionChange([]);
                  }
                }}
                checked={processedData.length > 0 && currentSelectedItems.length === processedData.length}
                indeterminate={currentSelectedItems.length > 0 && currentSelectedItems.length < processedData.length}
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
        cell: ({ row }) => (
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
        ),
      };
      finalColumns.push(selectionColumn);
    }

    // Process user-defined columns
    const processedUserColumns = columns.map(column => {
      const processedColumn = {
        accessorKey: column.key,
        enableSorting: false,
        enableColumnFilter: false,
        ...column
      };

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
          />
        );
      }

      return processedColumn;
    });

    finalColumns = [...finalColumns, ...processedUserColumns];

    // Add actions column if exists
    if (actionColumn) {
      finalColumns.push(actionColumn);
    }

    return finalColumns;
  }, [columns, processedData, currentSelectedItems, onSelectedChange, actionColumn, internalSorting, internalFilters, handleInternalSort, handleInternalFilter]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card className={`border-0 shadow-sm ${className}`}>
            <CardBody className="p-4">
              <div className="table-responsive">
                <TableContainer
                  columns={processedColumns}
                  data={processedData}
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
            bsSize="sm"
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
  components: PropTypes.node
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
  onFilter: PropTypes.func
};

// Asignar subcomponentes
AzTable.Actions = AzTableActions;

// También exportar AzTable directamente para uso interno
export { AzTable, AzTableActions };
export default AzTable;