import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Branch } from '../models/CompanyModel';

/**
 * Hook para acceder al estado de Company (solo lectura + helpers síncronos)
 */
export const useCompany = () => {
  const company = useSelector((state: RootState) => state.company.company);
  const branches = useSelector((state: RootState) => state.company.branches);
  const currentView = useSelector((state: RootState) => state.company.currentView);
  const loading = useSelector((state: RootState) => state.company.loading);
  const error = useSelector((state: RootState) => state.company.error);

  /**
   * Buscar sucursal por ID
   */
  const findBranchById = (id: number): Branch | undefined => {
    return branches.find(b => b.id === id);
  };

  /**
   * Obtener total de sucursales
   */
  const getBranchesTotal = (): number => {
    return branches.length;
  };

  /**
   * Obtener sucursales activas
   */
  const getActiveBranches = (): Branch[] => {
    return branches.filter(b => b.active);
  };

  /**
   * Obtener sucursales inactivas
   */
  const getInactiveBranches = (): Branch[] => {
    return branches.filter(b => !b.active);
  };

  return {
    company,
    branches,
    currentView,
    loading,
    error,
    findBranchById,
    getBranchesTotal,
    getActiveBranches,
    getInactiveBranches,
  };
};
