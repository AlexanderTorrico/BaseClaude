import React, { useCallback } from "react";
import ColumnFilter from "./ColumnFilter";

const SortableHeader = React.memo(({ column, children, canSort = true, sorting, onSort, columnFilters, onFilterChange }) => {
  const getSortIcon = () => {
    if (sorting.column !== column) return 'mdi-sort';
    if (sorting.direction === 'asc') return 'mdi-sort-ascending';
    if (sorting.direction === 'desc') return 'mdi-sort-descending';
    return 'mdi-sort';
  };

  const getSortIconColor = () => {
    return sorting.column === column ? 'text-primary' : 'text-muted';
  };

  const handleClick = useCallback(() => {
    if (canSort) {
      onSort(column);
    }
  }, [canSort, column, onSort]);

  return (
    <div>
      <div 
        className={`d-flex align-items-center justify-content-between fw-medium ${canSort ? 'sortable-header' : ''}`}
        onClick={handleClick}
        style={{ cursor: canSort ? 'pointer' : 'default', userSelect: 'none' }}
        title={canSort ? 'Clic para ordenar' : ''}
      >
        <span>{children}</span>
        {canSort && (
          <i 
            className={`mdi ${getSortIcon()} ms-1 ${getSortIconColor()}`}
            style={{ fontSize: '14px' }}
          ></i>
        )}
      </div>
      <ColumnFilter 
        column={column} 
        value={columnFilters[column]} 
        onChange={onFilterChange}
        placeholder={`Filtrar ${children.toLowerCase()}...`}
      />
    </div>
  );
});

SortableHeader.displayName = 'SortableHeader';

export default SortableHeader;