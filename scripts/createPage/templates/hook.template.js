export default (moduleName) => `import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ${moduleName}Controller } from '../controllers/${moduleName}Controller';
import { ControllerResponse } from '@/shared/controllers/ControllerResponse';

/**
 * Hook personalizado para ${moduleName}
 */
export const use${moduleName} = () => {
  const data = useSelector((state: RootState) => state.${moduleName.toLowerCase()}.data);
  const loading = useSelector((state: RootState) => state.${moduleName.toLowerCase()}.loading);
  const error = useSelector((state: RootState) => state.${moduleName.toLowerCase()}.error);

  // ==========================================
  // FUNCIONES ASÍNCRONAS (llaman al Controller)
  // ==========================================

  const fetchData = async (): Promise<ControllerResponse<any>> => {
    return await ${moduleName}Controller.getData();
  };

  // ==========================================
  // FUNCIONES SÍNCRONAS (lógica de negocio local)
  // ==========================================

  const getTotalItems = (): number => {
    return data?.length || 0;
  };

  return {
    // Estado de Redux
    data,
    loading,
    error,

    // Funciones async
    fetchData,

    // Funciones sync
    getTotalItems
  };
};
`;
