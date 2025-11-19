import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CreatePageModel } from '../models/CreatePageModel';

/**
 * Hook para acceder al estado de CreatePage (solo lectura + helpers síncronos)
 */
export const useCreatePage = () => {
  const createpages = useSelector((state: RootState) => state.createpage.list);
  const currentView = useSelector((state: RootState) => state.createpage.currentView);

  /**
   * Buscar por ID
   */
  const findById = (id: number): CreatePageModel | undefined => {
    return createpages.find(item => item.id === id);
  };

  /**
   * Obtener total de elementos
   */
  const getTotal = (): number => {
    return createpages.length;
  };

  return {
    createpages,
    currentView,
    findById,
    getTotal,
  };
};
