import React from 'react'
import { useState, useMemo } from "react";

export const useCrudFilters = (data) => {
  const [columnFilters, setColumnFilters] = useState({});
  const [sorting, setSorting] = useState({ column: null, direction: null });
  const [cardSearchTerm, setCardSearchTerm] = useState('');
  const [cardSorting, setCardSorting] = useState({ field: 'nombre', direction: 'asc' });

  // Función para aplicar filtros unificados
  const applyUnifiedFilters = useMemo(() => (baseData, searchTerm, filters, sortConfig) => {
    let result = [...baseData];

    // Aplicar búsqueda general (desde cards) o filtros específicos (desde tabla)
    if (searchTerm) {
      result = result.filter(item => {
        return Object.values(item).some(value => 
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    } else {
      // Aplicar filtros de columna solo si no hay búsqueda general
      Object.entries(filters).forEach(([column, value]) => {
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
    }

    // Aplicar ordenamiento (priorizar sorting de tabla, luego cardSorting)
    const sortColumn = sortConfig.column || sortConfig.field;
    const sortDirection = sortConfig.direction;
    
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sortDirection === 'asc' ? comparison : -comparison;
        }
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, []);

  // Datos filtrados unificados - prioriza filtros de tabla sobre búsqueda de cards
  const unifiedFilteredData = useMemo(() => {
    const hasColumnFilters = Object.values(columnFilters).some(value => value);
    const hasTableSorting = sorting.column && sorting.direction;
    
    // Determinar qué filtros y ordenamiento usar
    const effectiveSearchTerm = hasColumnFilters ? '' : cardSearchTerm;
    const effectiveFilters = hasColumnFilters ? columnFilters : {};
    const effectiveSorting = hasTableSorting ? sorting : cardSorting;
    
    return applyUnifiedFilters(data, effectiveSearchTerm, effectiveFilters, effectiveSorting);
  }, [data, columnFilters, sorting, cardSearchTerm, cardSorting, applyUnifiedFilters]);

  // Mantener compatibilidad con nombres anteriores
  const filteredData = unifiedFilteredData;
  const filteredCardsData = unifiedFilteredData;

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
    setCardSearchTerm('');
    setCardSorting({ field: 'nombre', direction: 'asc' });
  };

  const handleCardSearchChange = (value) => {
    setCardSearchTerm(value);
    // Si se empieza a buscar en cards, limpiar filtros de tabla para evitar conflictos
    if (value && Object.values(columnFilters).some(v => v)) {
      setColumnFilters({});
    }
  };

  const handleCardSortFieldChange = (field) => {
    setCardSorting(prev => ({ ...prev, field }));
    // Si se cambia ordenamiento en cards, limpiar ordenamiento de tabla
    if (sorting.column) {
      setSorting({ column: null, direction: null });
    }
  };

  const handleCardSortDirectionChange = (direction) => {
    setCardSorting(prev => ({ ...prev, direction }));
    // Si se cambia ordenamiento en cards, limpiar ordenamiento de tabla
    if (sorting.column) {
      setSorting({ column: null, direction: null });
    }
  };

  const clearCardFilters = () => {
    setCardSearchTerm('');
    setCardSorting({ field: 'nombre', direction: 'asc' });
  };

  // Función para manejar filtros de tabla y limpiar cards si es necesario
  const handleColumnFilterUnified = (column, value) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
    // Si se empieza a filtrar en tabla, limpiar búsqueda de cards
    if (value && cardSearchTerm) {
      setCardSearchTerm('');
    }
  };

  const handleSortUnified = (column) => {
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
    // Si se ordena en tabla, limpiar ordenamiento de cards
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

  // Obtener filtros activos unificados
  const getActiveUnifiedFilters = () => {
    const hasColumnFilters = Object.values(columnFilters).some(value => value);
    
    if (hasColumnFilters) {
      return getActiveFilters();
    } else if (cardSearchTerm) {
      return [['search', cardSearchTerm]];
    }
    
    return [];
  };

  return {
    columnFilters,
    sorting,
    cardSearchTerm,
    cardSorting,
    filteredData,
    filteredCardsData,
    // Funciones originales (mantener compatibilidad)
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
    getActiveFilters,
    // Nuevas funciones unificadas
    handleColumnFilterUnified,
    handleSortUnified,
    getActiveUnifiedFilters,
    // Datos unificados
    unifiedFilteredData
  };
};
