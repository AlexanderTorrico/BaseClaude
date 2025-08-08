import { useState, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

const useSearch = (data = [], config = {}) => {
  const {
    searchableFields = [],
    defaultFilters = {},
    searchDelay = 300,
    caseSensitive = false,
  } = config;

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [advancedSearch, setAdvancedSearch] = useState({});

  const debouncedSearch = useCallback(
    debounce((term) => setSearchTerm(term), searchDelay),
    [searchDelay]
  );

  const handleSearch = useCallback((term) => {
    debouncedSearch(term);
  }, [debouncedSearch]);

  const addFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const removeFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    setAdvancedSearch({});
  }, []);

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const updateAdvancedSearch = useCallback((newAdvanced) => {
    setAdvancedSearch(prev => ({ ...prev, ...newAdvanced }));
  }, []);

  const searchInFields = useCallback((item, term) => {
    if (!term) return true;
    
    const searchText = caseSensitive ? term : term.toLowerCase();
    
    if (searchableFields.length === 0) {
      return Object.values(item).some(value => {
        if (value === null || value === undefined) return false;
        const fieldValue = caseSensitive ? String(value) : String(value).toLowerCase();
        return fieldValue.includes(searchText);
      });
    }
    
    return searchableFields.some(field => {
      const fieldValue = item[field];
      if (fieldValue === null || fieldValue === undefined) return false;
      const normalizedValue = caseSensitive ? String(fieldValue) : String(fieldValue).toLowerCase();
      return normalizedValue.includes(searchText);
    });
  }, [searchableFields, caseSensitive]);

  const applyFilters = useCallback((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === 'all' || !value) return true;
      return item[key] === value;
    });
  }, [filters]);

  const applyAdvancedSearch = useCallback((item) => {
    return Object.entries(advancedSearch).every(([key, searchConfig]) => {
      if (!searchConfig || !searchConfig.value) return true;
      
      const fieldValue = item[key];
      const searchValue = searchConfig.value;
      const operator = searchConfig.operator || 'contains';
      
      switch (operator) {
        case 'equals':
          return fieldValue === searchValue;
        case 'contains':
          return String(fieldValue).toLowerCase().includes(String(searchValue).toLowerCase());
        case 'startsWith':
          return String(fieldValue).toLowerCase().startsWith(String(searchValue).toLowerCase());
        case 'endsWith':
          return String(fieldValue).toLowerCase().endsWith(String(searchValue).toLowerCase());
        case 'greaterThan':
          return Number(fieldValue) > Number(searchValue);
        case 'lessThan':
          return Number(fieldValue) < Number(searchValue);
        case 'greaterThanOrEqual':
          return Number(fieldValue) >= Number(searchValue);
        case 'lessThanOrEqual':
          return Number(fieldValue) <= Number(searchValue);
        case 'notEquals':
          return fieldValue !== searchValue;
        case 'isEmpty':
          return !fieldValue || fieldValue === '';
        case 'isNotEmpty':
          return fieldValue && fieldValue !== '';
        default:
          return true;
      }
    });
  }, [advancedSearch]);

  const sortData = useCallback((data) => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      let comparison = 0;
      if (aValue > bValue) comparison = 1;
      if (aValue < bValue) comparison = -1;
      
      return sortConfig.direction === 'desc' ? comparison * -1 : comparison;
    });
  }, [sortConfig]);

  const filteredData = useMemo(() => {
    let result = data.filter(item => 
      searchInFields(item, searchTerm) && 
      applyFilters(item) &&
      applyAdvancedSearch(item)
    );
    
    result = sortData(result);
    
    return result;
  }, [data, searchTerm, filters, advancedSearch, searchInFields, applyFilters, applyAdvancedSearch, sortData]);

  const searchStats = useMemo(() => ({
    total: data.length,
    filtered: filteredData.length,
    hasActiveFilters: Object.keys(filters).length > 0 || searchTerm !== '' || Object.keys(advancedSearch).length > 0,
    activeFiltersCount: Object.keys(filters).length + (searchTerm ? 1 : 0) + Object.keys(advancedSearch).length
  }), [data.length, filteredData.length, filters, searchTerm, advancedSearch]);

  return {
    searchTerm,
    filters,
    sortConfig,
    advancedSearch,
    filteredData,
    searchStats,
    handleSearch,
    addFilter,
    removeFilter,
    clearFilters,
    handleSort,
    updateAdvancedSearch,
    setSearchTerm,
    setFilters,
    setSortConfig,
    setAdvancedSearch
  };
};

export default useSearch;