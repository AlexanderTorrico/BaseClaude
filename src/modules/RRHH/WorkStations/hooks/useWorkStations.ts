import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { RootState } from '@/store';
import { WorkStationModel } from '../models/WorkStationModel';
import { RequirementModel } from '../models/RequirementModel';
import { WorkStationController } from '../controllers/WorkStationController';
import {
  setCurrentView,
  setSelectedLevel,
  clearFilters,
  setSelectedWorkStation,
  clearSelection,
  openSidebar,
  closeSidebar,
  toggleSidebar
} from '../slices/workStationsSlice';
import { buildWorkStationTree } from '../utils/treeHelpers';
import { filterByLevel, getUniqueLevels, getLevelStatistics } from '../utils/levelHelpers';

/**
 * Hook personalizado para WorkStations
 * Patrón: Sync (useSelector) + Async (Controller calls)
 */

export const useWorkStations = () => {
  const dispatch = useDispatch();

  // =========================================================================
  // SELECTORES (Sync - desde Redux)
  // =========================================================================

  const workStations = useSelector((state: RootState) => state.workStations.list);
  const loading = useSelector((state: RootState) => state.workStations.loading);
  const error = useSelector((state: RootState) => state.workStations.error);
  const currentView = useSelector((state: RootState) => state.workStations.currentView);
  const selectedLevel = useSelector((state: RootState) => state.workStations.selectedLevel);
  const selectedWorkStation = useSelector((state: RootState) => state.workStations.selectedWorkStation);
  const requirements = useSelector((state: RootState) => state.workStations.requirements);
  const loadingRequirements = useSelector((state: RootState) => state.workStations.loadingRequirements);
  const isSidebarOpen = useSelector((state: RootState) => state.workStations.isSidebarOpen);

  // =========================================================================
  // DATOS CALCULADOS (useMemo para optimización)
  // =========================================================================

  /**
   * WorkStations filtrados por nivel
   */
  const filteredWorkStations = useMemo(() => {
    return filterByLevel(workStations, selectedLevel);
  }, [workStations, selectedLevel]);

  /**
   * Árbol jerárquico (para vista Organigrama)
   */
  const workStationTree = useMemo(() => {
    const dataToUse = selectedLevel !== null ? filteredWorkStations : workStations;
    return buildWorkStationTree(dataToUse);
  }, [workStations, filteredWorkStations, selectedLevel]);

  /**
   * Niveles únicos existentes en los datos
   */
  const availableLevels = useMemo(() => {
    return getUniqueLevels(workStations);
  }, [workStations]);

  /**
   * Estadísticas por nivel
   */
  const levelStatistics = useMemo(() => {
    return getLevelStatistics(workStations);
  }, [workStations]);

  /**
   * WorkStations agrupados por nivel (para vista Lista jerárquica)
   */
  const workStationsByLevel = useMemo(() => {
    const dataToUse = selectedLevel !== null ? filteredWorkStations : workStations;
    const grouped: Record<number, WorkStationModel[]> = {};

    dataToUse.forEach(ws => {
      if (!grouped[ws.level]) {
        grouped[ws.level] = [];
      }
      grouped[ws.level].push(ws);
    });

    return grouped;
  }, [workStations, filteredWorkStations, selectedLevel]);

  // =========================================================================
  // ACCIONES SÍNCRONAS (dispatch directo)
  // =========================================================================

  const handleSetCurrentView = (view: string) => {
    dispatch(setCurrentView(view));
  };

  const handleSetSelectedLevel = (level: number | null) => {
    dispatch(setSelectedLevel(level));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleSetSelectedWorkStation = (workStation: WorkStationModel | null) => {
    dispatch(setSelectedWorkStation(workStation));
  };

  const handleClearSelection = () => {
    dispatch(clearSelection());
  };

  const handleOpenSidebar = (workStation?: WorkStationModel) => {
    if (workStation) {
      dispatch(setSelectedWorkStation(workStation));
    }
    dispatch(openSidebar());
  };

  const handleCloseSidebar = () => {
    dispatch(closeSidebar());
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  // =========================================================================
  // ACCIONES ASÍNCRONAS (Controller calls)
  // =========================================================================

  const loadWorkStations = async () => {
    return await WorkStationController.getWorkStations();
  };

  const loadWorkStationById = async (id: number) => {
    return await WorkStationController.getWorkStationById(id);
  };

  const createWorkStation = async (data: Partial<WorkStationModel>) => {
    return await WorkStationController.createWorkStation(data);
  };

  const updateWorkStation = async (id: number, data: Partial<WorkStationModel>) => {
    return await WorkStationController.updateWorkStation(id, data);
  };

  const deleteWorkStation = async (id: number) => {
    return await WorkStationController.deleteWorkStation(id);
  };

  const loadRequirementsByWorkStation = async (workStationId: number) => {
    return await WorkStationController.getRequirementsByWorkStation(workStationId);
  };

  const createRequirement = async (data: Partial<RequirementModel>) => {
    return await WorkStationController.createRequirement(data);
  };

  const updateRequirement = async (id: number, data: Partial<RequirementModel>) => {
    return await WorkStationController.updateRequirement(id, data);
  };

  const deleteRequirement = async (id: number, workStationId: number) => {
    return await WorkStationController.deleteRequirement(id, workStationId);
  };

  // =========================================================================
  // CARGA INICIAL
  // =========================================================================

  useEffect(() => {
    // Solo cargar si la lista está vacía (caching inteligente)
    if (workStations.length === 0 && !loading && !error) {
      loadWorkStations();
    }
  }, []);

  // =========================================================================
  // RETURN
  // =========================================================================

  return {
    // Estado
    workStations,
    loading,
    error,
    currentView,
    selectedLevel,
    selectedWorkStation,
    requirements,
    loadingRequirements,
    isSidebarOpen,

    // Datos calculados
    filteredWorkStations,
    workStationTree,
    availableLevels,
    levelStatistics,
    workStationsByLevel,

    // Acciones síncronas
    setCurrentView: handleSetCurrentView,
    setSelectedLevel: handleSetSelectedLevel,
    clearFilters: handleClearFilters,
    setSelectedWorkStation: handleSetSelectedWorkStation,
    clearSelection: handleClearSelection,
    openSidebar: handleOpenSidebar,
    closeSidebar: handleCloseSidebar,
    toggleSidebar: handleToggleSidebar,

    // Acciones asíncronas
    loadWorkStations,
    loadWorkStationById,
    createWorkStation,
    updateWorkStation,
    deleteWorkStation,
    loadRequirementsByWorkStation,
    createRequirement,
    updateRequirement,
    deleteRequirement
  };
};
