import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// Import slice actions and selectors
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  clearError,
  clearSuccessMessage,
  clearCurrentProduct,
  setFilters,
  setSorting,
  clearFilters,
  setCurrentPage,
  setItemsPerPage,
  setSelectedItems,
  toggleSelectItem,
  selectAllItems,
  clearSelection,
  selectProducts,
  selectCurrentProduct,
  selectPagination,
  selectFilters,
  selectSorting,
  selectLoading,
  selectCreating,
  selectUpdating,
  selectDeleting,
  selectError,
  selectSuccessMessage,
  selectSelectedItems,
  selectIsLoading,
  selectHasProducts
} from './crudBasicSlice';

/**
 * Custom hook para manejar operaciones CRUD de productos
 * Aplica principios SOLID:
 * - S: Single Responsibility - Solo maneja lógica de productos
 * - O: Open/Closed - Extensible para nuevas operaciones
 * - L: Liskov Substitution - Puede sustituir otros hooks similares
 * - I: Interface Segregation - Expone solo métodos necesarios
 * - D: Dependency Inversion - Depende de abstracciones (Redux)
 */
const useCrudBasic = () => {
  const dispatch = useDispatch();

  // Selectors
  const products = useSelector(selectProducts);
  const currentProduct = useSelector(selectCurrentProduct);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);
  const sorting = useSelector(selectSorting);
  const loading = useSelector(selectLoading);
  const creating = useSelector(selectCreating);
  const updating = useSelector(selectUpdating);
  const deleting = useSelector(selectDeleting);
  const error = useSelector(selectError);
  const successMessage = useSelector(selectSuccessMessage);
  const selectedItems = useSelector(selectSelectedItems);
  const isLoading = useSelector(selectIsLoading);
  const hasProducts = useSelector(selectHasProducts);

  // Auto-fetch products on mount and dependency changes
  useEffect(() => {
    dispatch(fetchProducts({
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
      filters,
      sorting
    }));
  }, [dispatch, pagination.currentPage, pagination.itemsPerPage, filters, sorting]);

  // Handle error notifications
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle success notifications
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, dispatch]);

  // CRUD Operations
  const operations = useMemo(() => ({
    // Create operation
    create: useCallback(async (productData) => {
      try {
        const result = await dispatch(createProduct(productData)).unwrap();

        // Refresh data after creation
        dispatch(fetchProducts({
          page: 1, // Reset to first page
          limit: pagination.itemsPerPage,
          filters,
          sorting
        }));

        return result;
      } catch (error) {
        throw error;
      }
    }, [dispatch, pagination.itemsPerPage, filters, sorting]),

    // Read operations
    getAll: useCallback((options = {}) => {
      const {
        page = pagination.currentPage,
        limit = pagination.itemsPerPage,
        filters: customFilters = filters,
        sorting: customSorting = sorting
      } = options;

      return dispatch(fetchProducts({
        page,
        limit,
        filters: customFilters,
        sorting: customSorting
      }));
    }, [dispatch, pagination.currentPage, pagination.itemsPerPage, filters, sorting]),

    getById: useCallback((id) => {
      return dispatch(getProduct(id));
    }, [dispatch]),

    // Update operation
    update: useCallback(async (id, productData) => {
      try {
        const result = await dispatch(updateProduct({ id, productData })).unwrap();

        // Refresh current page after update
        dispatch(fetchProducts({
          page: pagination.currentPage,
          limit: pagination.itemsPerPage,
          filters,
          sorting
        }));

        return result;
      } catch (error) {
        throw error;
      }
    }, [dispatch, pagination.currentPage, pagination.itemsPerPage, filters, sorting]),

    // Delete operation
    remove: useCallback(async (id) => {
      try {
        const result = await dispatch(deleteProduct(id)).unwrap();

        // Check if we need to go to previous page after deletion
        const remainingItems = products.length - 1;
        const shouldGoToPrevPage =
          remainingItems === 0 &&
          pagination.currentPage > 1;

        if (shouldGoToPrevPage) {
          dispatch(setCurrentPage(pagination.currentPage - 1));
        } else {
          // Just refresh current page
          dispatch(fetchProducts({
            page: pagination.currentPage,
            limit: pagination.itemsPerPage,
            filters,
            sorting
          }));
        }

        return result;
      } catch (error) {
        throw error;
      }
    }, [dispatch, products.length, pagination.currentPage, pagination.itemsPerPage, filters, sorting]),

    // Bulk delete operation
    bulkDelete: useCallback(async (ids) => {
      try {
        const promises = ids.map(id => dispatch(deleteProduct(id)).unwrap());
        await Promise.all(promises);

        // Clear selection and refresh data
        dispatch(clearSelection());
        dispatch(fetchProducts({
          page: 1, // Reset to first page after bulk delete
          limit: pagination.itemsPerPage,
          filters,
          sorting
        }));

        toast.success(`${ids.length} productos eliminados exitosamente`);
      } catch (error) {
        toast.error('Error al eliminar productos seleccionados');
        throw error;
      }
    }, [dispatch, pagination.itemsPerPage, filters, sorting])
  }), [dispatch, products.length, pagination, filters, sorting]);

  // Filter and Sorting Operations
  const filterOperations = useMemo(() => ({
    setFilter: useCallback((filterKey, value) => {
      const newFilters = { ...filters, [filterKey]: value };

      // Remove empty filters
      Object.keys(newFilters).forEach(key => {
        if (!newFilters[key] || newFilters[key] === '') {
          delete newFilters[key];
        }
      });

      dispatch(setFilters(newFilters));
      dispatch(setCurrentPage(1)); // Reset to first page when filtering
    }, [dispatch, filters]),

    setSort: useCallback((field, direction) => {
      const newSorting = { field, direction };
      dispatch(setSorting(newSorting));
      dispatch(setCurrentPage(1)); // Reset to first page when sorting
    }, [dispatch]),

    clearAllFilters: useCallback(() => {
      dispatch(clearFilters());
      dispatch(setCurrentPage(1));
    }, [dispatch]),

    applyFilters: useCallback((newFilters) => {
      dispatch(setFilters(newFilters));
      dispatch(setCurrentPage(1));
    }, [dispatch])
  }), [dispatch, filters]);

  // Pagination Operations
  const paginationOperations = useMemo(() => ({
    goToPage: useCallback((page) => {
      if (page >= 1 && page <= pagination.totalPages) {
        dispatch(setCurrentPage(page));
      }
    }, [dispatch, pagination.totalPages]),

    nextPage: useCallback(() => {
      if (pagination.hasNextPage) {
        dispatch(setCurrentPage(pagination.currentPage + 1));
      }
    }, [dispatch, pagination.hasNextPage, pagination.currentPage]),

    prevPage: useCallback(() => {
      if (pagination.hasPrevPage) {
        dispatch(setCurrentPage(pagination.currentPage - 1));
      }
    }, [dispatch, pagination.hasPrevPage, pagination.currentPage]),

    changeItemsPerPage: useCallback((itemsPerPage) => {
      dispatch(setItemsPerPage(itemsPerPage));
    }, [dispatch])
  }), [dispatch, pagination]);

  // Selection Operations
  const selectionOperations = useMemo(() => ({
    selectItem: useCallback((id) => {
      dispatch(toggleSelectItem(id));
    }, [dispatch]),

    selectAll: useCallback(() => {
      dispatch(selectAllItems());
    }, [dispatch]),

    clearSelection: useCallback(() => {
      dispatch(clearSelection());
    }, [dispatch]),

    setSelected: useCallback((ids) => {
      dispatch(setSelectedItems(ids));
    }, [dispatch]),

    isSelected: useCallback((id) => {
      return selectedItems.includes(id);
    }, [selectedItems]),

    isAllSelected: useMemo(() => {
      return products.length > 0 && selectedItems.length === products.length;
    }, [products.length, selectedItems.length]),

    isIndeterminate: useMemo(() => {
      return selectedItems.length > 0 && selectedItems.length < products.length;
    }, [products.length, selectedItems.length])
  }), [dispatch, selectedItems, products.length]);

  // Utility Operations
  const utilityOperations = useMemo(() => ({
    refresh: useCallback(() => {
      dispatch(fetchProducts({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        filters,
        sorting
      }));
    }, [dispatch, pagination.currentPage, pagination.itemsPerPage, filters, sorting]),

    clearCurrentProduct: useCallback(() => {
      dispatch(clearCurrentProduct());
    }, [dispatch]),

    resetToFirstPage: useCallback(() => {
      dispatch(setCurrentPage(1));
    }, [dispatch])
  }), [dispatch, pagination.currentPage, pagination.itemsPerPage, filters, sorting]);

  // Computed values
  const computed = useMemo(() => ({
    hasData: hasProducts,
    isEmpty: !hasProducts && !loading,
    hasSelection: selectedItems.length > 0,
    selectedCount: selectedItems.length,
    totalCount: pagination.totalItems,
    hasFilters: Object.keys(filters).length > 0 || (sorting.field && sorting.direction),
    canLoadMore: pagination.hasNextPage,
    currentPageItems: products.length,
    pageInfo: {
      current: pagination.currentPage,
      total: pagination.totalPages,
      showing: products.length,
      of: pagination.totalItems,
      from: ((pagination.currentPage - 1) * pagination.itemsPerPage) + 1,
      to: Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)
    }
  }), [
    hasProducts,
    loading,
    selectedItems.length,
    pagination,
    filters,
    sorting,
    products.length
  ]);

  // Return hook interface
  return {
    // Data
    products,
    currentProduct,
    pagination,
    filters,
    sorting,
    selectedItems,

    // Loading states
    loading,
    creating,
    updating,
    deleting,
    isLoading,

    // Error handling
    error,
    successMessage,

    // Operations
    ...operations,
    ...filterOperations,
    ...paginationOperations,
    ...selectionOperations,
    ...utilityOperations,

    // Computed values
    ...computed
  };
};

export default useCrudBasic;