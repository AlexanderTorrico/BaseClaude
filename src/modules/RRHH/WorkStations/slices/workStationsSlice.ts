import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkStationModel } from '../models/WorkStationModel';
import { RequirementModel } from '../models/RequirementModel';

/**
 * Estado de WorkStations en Redux
 * Patrón estándar: { list, loading, error, ... }
 */

interface WorkStationState {
  // Lista principal de work stations
  list: WorkStationModel[];
  loading: boolean;
  error: string | null;

  // Vista actual: '0' = Organigrama, '1' = Lista jerárquica, '2' = Tabla
  currentView: string;

  // WorkStation seleccionado (para edición o ver requisitos)
  selectedWorkStation: WorkStationModel | null;

  // Filtro por nivel
  selectedLevel: number | null;

  // Requirements del workstation seleccionado
  requirements: RequirementModel[];
  loadingRequirements: boolean;

  // Panel lateral de requirements (abierto/cerrado)
  isSidebarOpen: boolean;
}

const initialState: WorkStationState = {
  list: [],
  loading: false,
  error: null,
  currentView: '0', // Por defecto: Organigrama
  selectedWorkStation: null,
  selectedLevel: null,
  requirements: [],
  loadingRequirements: false,
  isSidebarOpen: false
};

const workStationsSlice = createSlice({
  name: 'rrhh_workStation',
  initialState,
  reducers: {
    // =====================================================================
    // WORKSTATIONS
    // =====================================================================

    setWorkStations: (state, action: PayloadAction<WorkStationModel[]>) => {
      state.list = action.payload;
    },

    addWorkStation: (state, action: PayloadAction<WorkStationModel>) => {
      state.list.push(action.payload);
    },

    updateWorkStation: (state, action: PayloadAction<WorkStationModel>) => {
      const index = state.list.findIndex(ws => ws.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    deleteWorkStation: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(ws => ws.id !== action.payload);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // =====================================================================
    // VISTA Y FILTROS
    // =====================================================================

    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    },

    setSelectedLevel: (state, action: PayloadAction<number | null>) => {
      state.selectedLevel = action.payload;
    },

    clearFilters: (state) => {
      state.selectedLevel = null;
    },

    // =====================================================================
    // SELECCIÓN
    // =====================================================================

    setSelectedWorkStation: (state, action: PayloadAction<WorkStationModel | null>) => {
      state.selectedWorkStation = action.payload;
    },

    clearSelection: (state) => {
      state.selectedWorkStation = null;
      state.requirements = [];
      state.isSidebarOpen = false;
    },

    // =====================================================================
    // REQUIREMENTS
    // =====================================================================

    setRequirements: (state, action: PayloadAction<RequirementModel[]>) => {
      state.requirements = action.payload;
    },

    setLoadingRequirements: (state, action: PayloadAction<boolean>) => {
      state.loadingRequirements = action.payload;
    },

    addRequirement: (state, action: PayloadAction<RequirementModel>) => {
      state.requirements.push(action.payload);
    },

    updateRequirement: (state, action: PayloadAction<RequirementModel>) => {
      const index = state.requirements.findIndex(req => req.id === action.payload.id);
      if (index !== -1) {
        state.requirements[index] = action.payload;
      }
    },

    removeRequirement: (state, action: PayloadAction<number>) => {
      state.requirements = state.requirements.filter(req => req.id !== action.payload);
    },

    // =====================================================================
    // SIDEBAR
    // =====================================================================

    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },

    closeSidebar: (state) => {
      state.isSidebarOpen = false;
      state.selectedWorkStation = null;
    },

    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    // =====================================================================
    // RESET
    // =====================================================================

    resetState: () => initialState
  }
});

// Exportar acciones
export const {
  setWorkStations,
  addWorkStation,
  updateWorkStation,
  deleteWorkStation,
  setLoading,
  setError,
  setCurrentView,
  setSelectedLevel,
  clearFilters,
  setSelectedWorkStation,
  clearSelection,
  setRequirements,
  setLoadingRequirements,
  addRequirement,
  updateRequirement,
  removeRequirement,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  resetState
} = workStationsSlice.actions;

// Exportar reducer
export default workStationsSlice.reducer;
