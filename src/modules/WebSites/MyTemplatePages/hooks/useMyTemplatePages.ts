import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { MyTemplatePagesModel } from '../models/MyTemplatePagesModel';

/**
 * Hook para acceder al estado de MyTemplatePages (solo lectura + helpers síncronos)
 */
export const useMyTemplatePages = () => {
  const mytemplatepagess = useSelector((state: RootState) => state.mytemplatepages.list);
  const currentView = useSelector((state: RootState) => state.mytemplatepages.currentView);

  /**
   * Buscar por ID
   */
  const findById = (id: number): MyTemplatePagesModel | undefined => {
    return mytemplatepagess.find(item => item.id === id);
  };

  /**
   * Obtener total de elementos
   */
  const getTotal = (): number => {
    return mytemplatepagess.length;
  };

  return {
    mytemplatepagess,
    currentView,
    findById,
    getTotal,
  };
};
