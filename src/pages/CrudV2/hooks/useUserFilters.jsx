import { useState, useMemo, useCallback } from "react";
import { opcionesColumnaBusqueda } from "../utils/constants.js";

export const useUserFilters = (usuarios) => {
  // Estados para filtros de tabla
  const [columnFilters, setColumnFilters] = useState({});
  const [sorting, setSorting] = useState({ column: null, direction: null });
  
  // Estados para filtros de cards
  const [cardSearchTerm, setCardSearchTerm] = useState("");
  const [cardSearchColumn, setCardSearchColumn] = useState("all");
  const [cardSorting, setCardSorting] = useState({ field: "nombre", direction: "asc" });

  // Filtros para vista de tabla
  const usuariosFiltrados = useMemo(() => {
    let resultado = usuarios;

    const activeFilters = Object.entries(columnFilters).filter(([column, filterValue]) => 
      filterValue && filterValue.trim() !== ''
    );

    if (activeFilters.length > 0) {
      resultado = resultado.filter(usuario => {
        return activeFilters.every(([column, filterValue]) => {
          const cellValue = usuario[column];
          if (cellValue === null || cellValue === undefined) return false;
          
          return cellValue.toString().toLowerCase().includes(filterValue.toLowerCase());
        });
      });
    }

    if (sorting.column && sorting.direction) {
      resultado = [...resultado].sort((a, b) => {
        const aValue = a[sorting.column];
        const bValue = b[sorting.column];
        
        if (aValue === null || aValue === undefined) return sorting.direction === 'asc' ? -1 : 1;
        if (bValue === null || bValue === undefined) return sorting.direction === 'asc' ? 1 : -1;
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sorting.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = aValue.toString().toLowerCase();
        const bStr = bValue.toString().toLowerCase();
        
        if (aStr < bStr) return sorting.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sorting.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return resultado;
  }, [usuarios, columnFilters, sorting]);

  // Filtros para vista de cards
  const usuariosFiltradosCards = useMemo(() => {
    let resultado = usuarios;

    if (cardSearchTerm && cardSearchTerm.trim() !== '') {
      const searchTerm = cardSearchTerm.toLowerCase().trim();
      
      if (cardSearchColumn === 'all') {
        resultado = resultado.filter(usuario => 
          usuario.nombre.toLowerCase().includes(searchTerm) ||
          usuario.email.toLowerCase().includes(searchTerm) ||
          usuario.telefono.toLowerCase().includes(searchTerm) ||
          usuario.rol.toLowerCase().includes(searchTerm) ||
          usuario.departamento.toLowerCase().includes(searchTerm) ||
          usuario.estado.toLowerCase().includes(searchTerm) ||
          usuario.ciudad.toLowerCase().includes(searchTerm) ||
          usuario.empresa.toLowerCase().includes(searchTerm)
        );
      } else {
        resultado = resultado.filter(usuario => {
          const columnValue = usuario[cardSearchColumn];
          return columnValue && columnValue.toString().toLowerCase().includes(searchTerm);
        });
      }
    }

    if (cardSorting.field && cardSorting.direction) {
      resultado = [...resultado].sort((a, b) => {
        const aValue = a[cardSorting.field];
        const bValue = b[cardSorting.field];
        
        if (aValue === null || aValue === undefined) return cardSorting.direction === 'asc' ? -1 : 1;
        if (bValue === null || bValue === undefined) return cardSorting.direction === 'asc' ? 1 : -1;
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return cardSorting.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = aValue.toString().toLowerCase();
        const bStr = bValue.toString().toLowerCase();
        
        if (aStr < bStr) return cardSorting.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return cardSorting.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return resultado;
  }, [usuarios, cardSearchTerm, cardSearchColumn, cardSorting]);

  // Manejadores de filtros de tabla
  const handleColumnFilter = useCallback((column, value) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      
      if (!value || value.trim() === '') {
        delete newFilters[column];
      } else {
        newFilters[column] = value;
      }
      
      return newFilters;
    });
  }, []);

  const clearColumnFilter = useCallback((column) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[column];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setColumnFilters({});
  }, []);

  const handleSort = useCallback((column) => {
    setSorting(prevSorting => {
      if (prevSorting.column === column) {
        if (prevSorting.direction === 'asc') {
          return { column, direction: 'desc' };
        } else if (prevSorting.direction === 'desc') {
          return { column: null, direction: null };
        }
      } else {
        return { column, direction: 'asc' };
      }
      return prevSorting;
    });
  }, []);

  const clearSorting = useCallback(() => {
    setSorting({ column: null, direction: null });
  }, []);

  const clearAll = useCallback(() => {
    clearAllFilters();
    clearSorting();
  }, [clearAllFilters, clearSorting]);

  // Manejadores de filtros de cards
  const handleCardSearchChange = useCallback((value) => {
    setCardSearchTerm(value);
  }, []);

  const handleCardSearchColumnChange = useCallback((column) => {
    setCardSearchColumn(column);
  }, []);

  const handleCardSortFieldChange = useCallback((field) => {
    setCardSorting(prev => ({ ...prev, field }));
  }, []);

  const handleCardSortDirectionChange = useCallback((direction) => {
    setCardSorting(prev => ({ ...prev, direction }));
  }, []);

  const clearCardFilters = useCallback(() => {
    setCardSearchTerm("");
    setCardSearchColumn("all");
    setCardSorting({ field: "nombre", direction: "asc" });
  }, []);

  // Helpers
  const getActiveCardFilters = useCallback(() => {
    const activeFilters = [];
    
    if (cardSearchTerm && cardSearchTerm.trim() !== '') {
      const columnLabel = cardSearchColumn === 'all' ? 'Todas las columnas' : 
        opcionesColumnaBusqueda.find(opt => opt.value === cardSearchColumn)?.label || cardSearchColumn;
      activeFilters.push({ 
        type: 'search', 
        value: cardSearchTerm,
        column: columnLabel
      });
    }
    
    return activeFilters;
  }, [cardSearchTerm, cardSearchColumn]);

  const getActiveFilters = useCallback(() => {
    return Object.entries(columnFilters).filter(([column, filterValue]) => 
      filterValue && filterValue.trim() !== ''
    );
  }, [columnFilters]);

  return {
    // Estados
    columnFilters,
    sorting,
    cardSearchTerm,
    cardSearchColumn,
    cardSorting,
    
    // Datos filtrados
    usuariosFiltrados,
    usuariosFiltradosCards,
    
    // Manejadores de tabla
    handleColumnFilter,
    clearColumnFilter,
    clearAllFilters,
    handleSort,
    clearSorting,
    clearAll,
    
    // Manejadores de cards
    handleCardSearchChange,
    handleCardSearchColumnChange,
    handleCardSortFieldChange,
    handleCardSortDirectionChange,
    clearCardFilters,
    
    // Helpers
    getActiveCardFilters,
    getActiveFilters
  };
};