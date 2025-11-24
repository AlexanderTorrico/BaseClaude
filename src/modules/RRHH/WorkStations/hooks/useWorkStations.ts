import { useSelector, useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { RootState } from '@/store';
import { WorkStationModel } from '@/modules/RRHH/shared/models/WorkStationModel';
import { buildWorkStationTree } from '../utils/treeHelpers';
import { filterByLevel, getUniqueLevels, getLevelStatistics } from '../utils/levelHelpers';
import {
  setCurrentView,
  setSelectedLevel,
  clearFilters,
  setSelectedWorkStation,
  clearSelection,
  openSidebar,
  closeSidebar as closeSidebarAction,
  toggleSidebar
} from '../slices/workStationsSlice';

/**
 * Hook síncrono para WorkStations
 * Acceso a estado Redux y cálculos derivados
 * NO maneja peticiones asíncronas (usar useWorkStationsFetch para eso)
 */
export const useWorkStations = () => {
  const dispatch = useDispatch();

  // =========================================================================
  // SELECTORES (Sync - desde Redux)
  // =========================================================================

  const workStations = useSelector((state: RootState) => state.rrhh_workStation.list);
  const currentView = useSelector((state: RootState) => state.rrhh_workStation.currentView);
  const selectedLevel = useSelector((state: RootState) => state.rrhh_workStation.selectedLevel);
  const selectedWorkStation = useSelector((state: RootState) => state.rrhh_workStation.selectedWorkStation);
  const isSidebarOpen = useSelector((state: RootState) => state.rrhh_workStation.isSidebarOpen);
  const requirements = useSelector((state: RootState) => state.rrhh_workStation.requirements);
  const loadingRequirements = useSelector((state: RootState) => state.rrhh_workStation.loadingRequirements);

  // =========================================================================
  // DATOS CALCULADOS (useMemo para optimización)
  // =========================================================================

  /**
   * WorkStations filtrados por nivel
   */
  const filteredWorkStations = useMemo(() => {
    return filterByLevel(workStations, selectedLevel);
  }, [workStations, selectedLevel]);

  const workStationTree = useMemo(() => {
    const dataToUse = selectedLevel !== null ? filteredWorkStations : workStations;
    const showWarnings = selectedLevel === null;
    return buildWorkStationTree(dataToUse, showWarnings);
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
  // FUNCIONES HELPERS
  // =========================================================================

  /**
   * Encontrar un puesto de trabajo por ID
   */
  const findWorkStationById = (id: number): WorkStationModel | undefined => {
    return workStations.find(ws => ws.id === id);
  };

  /**
   * Encontrar un puesto de trabajo por nombre
   */
  const findWorkStationByName = (name: string): WorkStationModel | undefined => {
    return workStations.find(ws => ws.name.toLowerCase() === name.toLowerCase());
  };

  /**
   * Obtener total de puestos de trabajo
   */
  const getTotalWorkStations = (): number => {
    return workStations.length;
  };

  /**
   * Obtener puestos de trabajo de un nivel específico
   */
  const getWorkStationsByLevel = (level: number): WorkStationModel[] => {
    return workStations.filter(ws => ws.level === level);
  };

  /**
   * Obtener hijos directos de un puesto de trabajo
   */
  const getChildrenWorkStations = (parentId: number): WorkStationModel[] => {
    return workStations.filter(ws => ws.dependencyId === parentId);
  };

  /**
   * Verificar si un puesto tiene hijos
   */
  const hasChildren = (id: number): boolean => {
    return workStations.some(ws => ws.dependencyId === id);
  };

  // =========================================================================
  // ACCIONES SÍNCRONAS (dispatch directo a Redux)
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
    dispatch(closeSidebarAction());
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  // =========================================================================
  // RETURN
  // =========================================================================

  return {
    // Estado
    workStations,
    currentView,
    selectedLevel,
    selectedWorkStation,
    isSidebarOpen,
    requirements,
    loadingRequirements,

    // Datos calculados
    filteredWorkStations,
    workStationTree,
    availableLevels,
    levelStatistics,
    workStationsByLevel,

    // Funciones helpers
    findWorkStationById,
    findWorkStationByName,
    getTotalWorkStations,
    getWorkStationsByLevel,
    getChildrenWorkStations,
    hasChildren,

    // Acciones síncronas
    setCurrentView: handleSetCurrentView,
    setSelectedLevel: handleSetSelectedLevel,
    clearFilters: handleClearFilters,
    setSelectedWorkStation: handleSetSelectedWorkStation,
    clearSelection: handleClearSelection,
    openSidebar: handleOpenSidebar,
    closeSidebar: handleCloseSidebar,
    toggleSidebar: handleToggleSidebar,
  };
};
