import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CompanyModel } from '../models/CompanyModel';

/**
 * Hook para acceder al estado de Company (solo lectura + helpers síncronos)
 */
export const useCompany = () => {
  const companies = useSelector((state: RootState) => state.company.list);
  const currentView = useSelector((state: RootState) => state.company.currentView);
  const selectedCompanyId = useSelector((state: RootState) => state.company.selectedCompanyId);

  /**
   * Buscar compañía por ID
   */
  const findById = (id: number): CompanyModel | undefined => {
    return companies.find(item => item.id === id);
  };

  /**
   * Obtener compañía seleccionada
   */
  const getSelectedCompany = (): CompanyModel | undefined => {
    return selectedCompanyId ? findById(selectedCompanyId) : undefined;
  };

  /**
   * Obtener total de compañías
   */
  const getTotal = (): number => {
    return companies.length;
  };

  /**
   * Verificar si hay compañías
   */
  const hasCompanies = (): boolean => {
    return companies.length > 0;
  };

  return {
    companies,
    currentView,
    selectedCompanyId,
    findById,
    getSelectedCompany,
    getTotal,
    hasCompanies,
  };
};
