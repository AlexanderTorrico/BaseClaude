import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { MyPagesModel } from '../models/MyPagesModel';

/**
 * Hook para acceder al estado de MyPages (solo lectura + helpers síncronos)
 */
export const useMyPages = () => {
  const mypagess = useSelector((state: RootState) => state.mypages.list);
  const currentView = useSelector((state: RootState) => state.mypages.currentView);

  /**
   * Buscar por ID
   */
  const findById = (id: number): MyPagesModel | undefined => {
    return mypagess.find(item => item.id === id);
  };

  /**
   * Obtener total de elementos
   */
  const getTotal = (): number => {
    return mypagess.length;
  };

  return {
    mypagess,
    currentView,
    findById,
    getTotal,
  };
};
