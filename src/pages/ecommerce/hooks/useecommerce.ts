import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ecommerceModel } from '../models/ecommerceModel';

/**
 * Hook para acceder al estado de ecommerce (solo lectura + helpers síncronos)
 */
export const useecommerce = () => {
  const ecommerces = useSelector((state: RootState) => state.ecommerce.list);
  const currentView = useSelector((state: RootState) => state.ecommerce.currentView);

  /**
   * Buscar por ID
   */
  const findById = (id: number): ecommerceModel | undefined => {
    return ecommerces.find(item => item.id === id);
  };

  /**
   * Obtener total de elementos
   */
  const getTotal = (): number => {
    return ecommerces.length;
  };

  return {
    ecommerces,
    currentView,
    findById,
    getTotal,
  };
};
