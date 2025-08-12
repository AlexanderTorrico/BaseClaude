import { useState, useMemo } from "react";

export const useCrudFilters = (data) => {
  const [columnFilters, setColumnFilters] = useState({});
  const [sorting, setSorting] = useState({ column: null, direction: null });
  const [cardSearchTerm, setCardSearchTerm] = useState('');
  const [cardSorting, setCardSorting] = useState({ field: 'nombre', direction: 'asc' });

  const filteredData = useMemo(() => {
    let result = [...data];

    Object.entries(columnFilters).forEach(([column, value]) => {
      if (value) {
        result = result.filter(item => {
          const itemValue = item[column];
          if (typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(value.toLowerCase());
          }
          return itemValue?.toString().toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    if (sorting.column && sorting.direction) {
      result.sort((a, b) => {
        const aValue = a[sorting.column];
        const bValue = b[sorting.column];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sorting.direction === 'asc' ? comparison : -comparison;
        }
        
        if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, columnFilters, sorting]);

  const filteredCardsData = useMemo(() => {
    let result = [...data];

    if (cardSearchTerm) {
      result = result.filter(item => {
        return Object.values(item).some(value => 
          value?.toString().toLowerCase().includes(cardSearchTerm.toLowerCase())
        );
      });
    }

    if (cardSorting.field && cardSorting.direction) {
      result.sort((a, b) => {
        const aValue = a[cardSorting.field];
        const bValue = b[cardSorting.field];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return cardSorting.direction === 'asc' ? comparison : -comparison;
        }
        
        if (aValue < bValue) return cardSorting.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return cardSorting.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, cardSearchTerm, cardSorting]);

  const handleColumnFilter = (column, value) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const clearColumnFilter = (column) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[column];
      return newFilters;
    });
  };

  const handleSort = (column) => {
    setSorting(prev => {
      if (prev.column === column) {
        if (prev.direction === 'asc') {
          return { column, direction: 'desc' };
        } else {
          return { column: null, direction: null };
        }
      }
      return { column, direction: 'asc' };
    });
  };

  const clearSorting = () => {
    setSorting({ column: null, direction: null });
  };

  const clearAll = () => {
    setColumnFilters({});
    setSorting({ column: null, direction: null });
  };

  const handleCardSearchChange = (value) => {
    setCardSearchTerm(value);
  };

  const handleCardSortFieldChange = (field) => {
    setCardSorting(prev => ({ ...prev, field }));
  };

  const handleCardSortDirectionChange = (direction) => {
    setCardSorting(prev => ({ ...prev, direction }));
  };

  const clearCardFilters = () => {
    setCardSearchTerm('');
    setCardSorting({ field: 'nombre', direction: 'asc' });
  };

  const getActiveCardFilters = () => {
    const filters = [];
    if (cardSearchTerm) {
      filters.push(['search', cardSearchTerm]);
    }
    return filters;
  };

  const getActiveFilters = () => {
    return Object.entries(columnFilters).filter(([, value]) => value);
  };

  return {
    columnFilters,
    sorting,
    cardSearchTerm,
    cardSorting,
    filteredData,
    filteredCardsData,
    handleColumnFilter,
    clearColumnFilter,
    handleSort,
    clearSorting,
    clearAll,
    handleCardSearchChange,
    handleCardSortFieldChange,
    handleCardSortDirectionChange,
    clearCardFilters,
    getActiveCardFilters,
    getActiveFilters
  };
};