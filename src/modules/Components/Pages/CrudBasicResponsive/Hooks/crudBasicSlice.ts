import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { get, post, put, del } from '../../../../../helpers/api_helper';

// Types
interface Product {
  id: string | number;
  name?: string;
  [key: string]: any;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Sorting {
  field: string;
  direction: string;
}

interface Filters {
  [key: string]: any;
}

interface FetchProductsParams {
  page?: number;
  limit?: number;
  filters?: Filters;
  sorting?: Sorting;
}

interface ApiResponse<T> {
  data?: T[];
  products?: T[];
  pagination?: Partial<Pagination>;
  [key: string]: any;
}

interface UpdateProductParams {
  id: string | number;
  productData: Partial<Product>;
}

interface CrudBasicState {
  // Data
  products: Product[];
  currentProduct: Product | null;

  // Pagination
  pagination: Pagination;

  // Filters and sorting
  filters: Filters;
  sorting: Sorting;

  // UI states
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;

  // Error handling
  error: string | null;

  // Success messages
  successMessage: string | null;

  // Selected items for bulk operations
  selectedItems: (string | number)[];
}

// API endpoints
const API_ENDPOINTS = {
  products: '/api/products',
  product: (id: string | number) => `/api/products/${id}`,
};

// Async thunks for API calls
export const fetchProducts = createAsyncThunk<
  ApiResponse<Product>,
  FetchProductsParams,
  { rejectValue: { message: string } }
>(
  'crudBasic/fetchProducts',
  async ({ page = 1, limit = 10, filters = {}, sorting = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
        ...(sorting.field && { sortBy: sorting.field, sortOrder: sorting.direction })
      });

      const response = await get(`${API_ENDPOINTS.products}?${params}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Error al obtener productos' });
    }
  }
);

export const createProduct = createAsyncThunk<
  Product,
  Partial<Product>,
  { rejectValue: { message: string } }
>(
  'crudBasic/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await post(API_ENDPOINTS.products, productData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Error al crear producto' });
    }
  }
);

export const updateProduct = createAsyncThunk<
  Product,
  UpdateProductParams,
  { rejectValue: { message: string } }
>(
  'crudBasic/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await put(API_ENDPOINTS.product(id), productData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Error al actualizar producto' });
    }
  }
);

export const deleteProduct = createAsyncThunk<
  string | number,
  string | number,
  { rejectValue: { message: string } }
>(
  'crudBasic/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await del(API_ENDPOINTS.product(id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Error al eliminar producto' });
    }
  }
);

export const getProduct = createAsyncThunk<
  Product,
  string | number,
  { rejectValue: { message: string } }
>(
  'crudBasic/getProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await get(API_ENDPOINTS.product(id));
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Error al obtener producto' });
    }
  }
);

// Initial state
const initialState: CrudBasicState = {
  // Data
  products: [],
  currentProduct: null,

  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  },

  // Filters and sorting
  filters: {},
  sorting: { field: '', direction: '' },

  // UI states
  loading: false,
  creating: false,
  updating: false,
  deleting: false,

  // Error handling
  error: null,

  // Success messages
  successMessage: null,

  // Selected items for bulk operations
  selectedItems: []
};

const crudBasicSlice = createSlice({
  name: 'crudBasic',
  initialState,
  reducers: {
    // UI State management
    clearError: (state) => {
      state.error = null;
    },

    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },

    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },

    // Filters and sorting
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
    },

    setSorting: (state, action: PayloadAction<Sorting>) => {
      state.sorting = action.payload;
    },

    clearFilters: (state) => {
      state.filters = {};
      state.sorting = { field: '', direction: '' };
    },

    // Pagination
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },

    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1; // Reset to first page
    },

    // Selection management
    setSelectedItems: (state, action: PayloadAction<(string | number)[]>) => {
      state.selectedItems = action.payload;
    },

    toggleSelectItem: (state, action: PayloadAction<string | number>) => {
      const itemId = action.payload;
      const index = state.selectedItems.indexOf(itemId);
      if (index > -1) {
        state.selectedItems.splice(index, 1);
      } else {
        state.selectedItems.push(itemId);
      }
    },

    selectAllItems: (state) => {
      state.selectedItems = state.products.map(product => product.id);
    },

    clearSelection: (state) => {
      state.selectedItems = [];
    },

    // Local data manipulation (optimistic updates)
    addProductLocal: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload);
      state.pagination.totalItems += 1;
    },

    updateProductLocal: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index > -1) {
        state.products[index] = action.payload;
      }
    },

    removeProductLocal: (state, action: PayloadAction<string | number>) => {
      const id = action.payload;
      state.products = state.products.filter(p => p.id !== id);
      state.selectedItems = state.selectedItems.filter(itemId => itemId !== id);
      state.pagination.totalItems -= 1;
    }
  },

  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || action.payload.products || [];

        // Update pagination info
        const { pagination } = action.payload;
        if (pagination) {
          state.pagination = {
            currentPage: pagination.currentPage || 1,
            totalPages: pagination.totalPages || 0,
            totalItems: pagination.totalItems || 0,
            itemsPerPage: pagination.itemsPerPage || 10,
            hasNextPage: pagination.hasNextPage || false,
            hasPrevPage: pagination.hasPrevPage || false
          };
        }

        state.error = null;
        state.selectedItems = []; // Clear selection on new data
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar productos';
        state.products = [];
      });

    // Create Product
    builder
      .addCase(createProduct.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.creating = false;
        // Note: We might need to refetch data instead of adding locally
        // depending on pagination and filters
        state.successMessage = 'Producto creado exitosamente';
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload?.message || 'Error al crear producto';
      });

    // Update Product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updating = false;
        state.successMessage = 'Producto actualizado exitosamente';
        state.currentProduct = action.payload;

        // Update in local list if present
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index > -1) {
          state.products[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload?.message || 'Error al actualizar producto';
      });

    // Delete Product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleting = false;
        state.successMessage = 'Producto eliminado exitosamente';

        // Remove from local list
        const id = action.payload;
        state.products = state.products.filter(p => p.id !== id);
        state.selectedItems = state.selectedItems.filter(itemId => itemId !== id);
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload?.message || 'Error al eliminar producto';
      });

    // Get Single Product
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al obtener producto';
        state.currentProduct = null;
      });
  }
});

// Export actions
export const {
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
  addProductLocal,
  updateProductLocal,
  removeProductLocal
} = crudBasicSlice.actions;

// Selectors - using any for now to maintain compatibility
export const selectProducts = (state: any) => state.crudBasic.products;
export const selectCurrentProduct = (state: any) => state.crudBasic.currentProduct;
export const selectPagination = (state: any) => state.crudBasic.pagination;
export const selectFilters = (state: any) => state.crudBasic.filters;
export const selectSorting = (state: any) => state.crudBasic.sorting;
export const selectLoading = (state: any) => state.crudBasic.loading;
export const selectCreating = (state: any) => state.crudBasic.creating;
export const selectUpdating = (state: any) => state.crudBasic.updating;
export const selectDeleting = (state: any) => state.crudBasic.deleting;
export const selectError = (state: any) => state.crudBasic.error;
export const selectSuccessMessage = (state: any) => state.crudBasic.successMessage;
export const selectSelectedItems = (state: any) => state.crudBasic.selectedItems;

// Compound selectors
export const selectIsLoading = (state: any) =>
  state.crudBasic.loading ||
  state.crudBasic.creating ||
  state.crudBasic.updating ||
  state.crudBasic.deleting;

export const selectHasProducts = (state: any) => state.crudBasic.products.length > 0;

export const selectTotalPages = (state: any) => state.crudBasic.pagination.totalPages;

export const selectCanLoadMore = (state: any) => state.crudBasic.pagination.hasNextPage;

export default crudBasicSlice.reducer;