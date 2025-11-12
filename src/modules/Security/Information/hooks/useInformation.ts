import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { InformationModel } from '../models/InformationModel';

/**
 * Hook para acceder al estado de Information (solo lectura + helpers síncronos)
 */
export const useInformation = () => {
  const informations = useSelector((state: RootState) => state.information.list);
  const currentView = useSelector((state: RootState) => state.information.currentView);

  /**
   * Buscar por ID
   */
  const findById = (id: number): InformationModel | undefined => {
    return informations.find(item => item.id === id);
  };

  /**
   * Obtener total de elementos
   */
  const getTotal = (): number => {
    return informations.length;
  };

  return {
    informations,
    currentView,
    findById,
    getTotal,
  };
};
