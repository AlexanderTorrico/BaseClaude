import React, { useMemo, useState, useEffect, Children } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Input } from "reactstrap";
import TableContainer from "../Common/TableContainer";
import AzTableHeader from "./AzTableHeader";

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
  children
}) => {
  const [internalSelectedItems, setInternalSelectedItems] = useState(selectedItems);

  useEffect(() => {
    setInternalSelectedItems(selectedItems);
  }, [selectedItems]);

  const handleSelectionChange = (newSelectedItems) => {
    setInternalSelectedItems(newSelectedItems);
    if (onSelectedChange) {
      onSelectedChange(newSelectedItems);
    }
  };

  const actionColumn = useMemo(() => {
    const actionsChild = Children.toArray(children).find(
      child => child.type?.displayName === 'AzTableActions'
    );

    if (!actionsChild) return null;

    return {
      header: (
        <div>
          <div className="d-flex align-items-center justify-content-between fw-medium">
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
          isSelected: internalSelectedItems.includes(row.original.id),
          ...actionsChild.props
        };
        return React.cloneElement(actionsChild, actionsProps);
      }
    };
  }, [children, internalSelectedItems]);

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
                    handleSelectionChange(data.map(item => item.id));
                  } else {
                    handleSelectionChange([]);
                  }
                }}
                checked={data.length > 0 && internalSelectedItems.length === data.length}
                indeterminate={internalSelectedItems.length > 0 && internalSelectedItems.length < data.length}
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
            checked={internalSelectedItems.includes(row.original.id)}
            onChange={(e) => {
              if (e.target.checked) {
                handleSelectionChange([...internalSelectedItems, row.original.id]);
              } else {
                handleSelectionChange(internalSelectedItems.filter(id => id !== row.original.id));
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
        enableSorting: false, // TableContainer handles sorting differently
        enableColumnFilter: false, // TableContainer handles filtering differently
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
            sorting={sorting}
            filters={filters}
            onSort={onSortChange}
            onFilter={onFilterChange}
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
  }, [columns, data, internalSelectedItems, onSelectedChange, actionColumn, sorting, filters, onSortChange, onFilterChange]);

  return (
    <Card className={`border-0 shadow-sm ${className}`}>
      <CardBody>
        <TableContainer
          columns={processedColumns}
          data={data}
          isGlobalFilter={false}
          isPagination={pagination}
          isCustomPageSize={false}
          SearchPlaceholder="Filtrar..."
          divClassName="table-responsive table-card mb-1"
          tableClass="align-middle table-nowrap"
          theadClass="table-light text-muted"
          paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
          pagination="pagination"
          {...tableProps}
        />
      </CardBody>
    </Card>
  );
};

// Actions component
const AzTableActions = ({ children, row, index, isSelected, ...props }) => {
  const processedChildren = Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ...child.props,
        'data-row': row,
        'data-index': index,
        'data-selected': isSelected,
        ...props
      });
    }
    return child;
  });

  return <div className="d-flex gap-2">{processedChildren}</div>;
};

AzTableActions.displayName = 'AzTableActions';

AzTable.Actions = AzTableActions;

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
  children: PropTypes.node
};

AzTableActions.propTypes = {
  children: PropTypes.node,
  row: PropTypes.object,
  index: PropTypes.number,
  isSelected: PropTypes.bool
};

export default AzTable;