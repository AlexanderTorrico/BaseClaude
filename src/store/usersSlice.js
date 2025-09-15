import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Datos estáticos de ejemplo para simular la API
const mockUsers = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan.perez@example.com",
    telefono: "+34 666 123 456",
    estado: "Activo",
    rol: "Administrador",
    fechaCreacion: "2023-01-15",
    ultimoAcceso: "2024-01-10",
    departamento: "Desarrollo",
    edad: 28,
    salario: 65000,
    experiencia: 5.5,
    avatar: null
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria.garcia@example.com",
    telefono: "+34 677 234 567",
    estado: "Inactivo",
    rol: "Usuario",
    fechaCreacion: "2022-03-22",
    ultimoAcceso: "2023-12-15",
    departamento: "Marketing",
    edad: 32,
    salario: 45000,
    experiencia: 8.2,
    avatar: null
  },
  {
    id: 3,
    nombre: "Carlos López",
    email: "carlos.lopez@example.com",
    telefono: "+34 688 345 678",
    estado: "Activo",
    rol: "Editor",
    fechaCreacion: "2021-07-10",
    ultimoAcceso: "2024-01-08",
    departamento: "Ventas",
    edad: 29,
    salario: 55000,
    experiencia: 7.0,
    avatar: null
  }
];

// Simular delay de red
const simulateNetworkDelay = (ms = 1000) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Async thunks para simular operaciones de API
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      await simulateNetworkDelay(800);
      // Simular posible error de red
      if (Math.random() < 0.1) {
        throw new Error('Error de conexión');
      }
      return [...mockUsers];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      await simulateNetworkDelay(600);

      // Validar datos requeridos
      if (!userData.nombre || !userData.email) {
        throw new Error('Nombre y email son requeridos');
      }

      // Simular validación de email único
      if (mockUsers.some(user => user.email === userData.email)) {
        throw new Error('El email ya está en uso');
      }

      const newUser = {
        id: Math.max(...mockUsers.map(u => u.id)) + 1,
        ...userData,
        fechaCreacion: new Date().toISOString().split('T')[0],
        ultimoAcceso: null
      };

      mockUsers.push(newUser);
      return newUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, ...userData }, { rejectWithValue }) => {
    try {
      await simulateNetworkDelay(600);

      const userIndex = mockUsers.findIndex(user => user.id === id);
      if (userIndex === -1) {
        throw new Error('Usuario no encontrado');
      }

      // Validar email único (excluyendo el usuario actual)
      if (userData.email &&
          mockUsers.some(user => user.email === userData.email && user.id !== id)) {
        throw new Error('El email ya está en uso');
      }

      const updatedUser = { ...mockUsers[userIndex], ...userData };
      mockUsers[userIndex] = updatedUser;

      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await simulateNetworkDelay(400);

      const userIndex = mockUsers.findIndex(user => user.id === userId);
      if (userIndex === -1) {
        throw new Error('Usuario no encontrado');
      }

      mockUsers.splice(userIndex, 1);
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    selectedUser: null,
    // Estados para modales
    isCreateModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    // Estados de operaciones
    creating: false,
    updating: false,
    deleting: false
  },
  reducers: {
    // Acciones síncronas para manejar UI
    clearError: (state) => {
      state.error = null;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    // Acciones para modales
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
      state.selectedUser = null;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
      state.selectedUser = null;
    },
    openEditModal: (state, action) => {
      state.isEditModalOpen = true;
      state.selectedUser = action.payload;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedUser = null;
    },
    openDeleteModal: (state, action) => {
      state.isDeleteModalOpen = true;
      state.selectedUser = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.creating = false;
        state.users.push(action.payload);
        state.isCreateModalOpen = false;
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.isEditModalOpen = false;
        state.selectedUser = null;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleting = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.isDeleteModalOpen = false;
        state.selectedUser = null;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  setSelectedUser,
  clearSelectedUser,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  openDeleteModal,
  closeDeleteModal
} = usersSlice.actions;

export default usersSlice.reducer;