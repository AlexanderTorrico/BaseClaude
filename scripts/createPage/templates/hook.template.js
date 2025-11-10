/**
 * Template para Hooks
 * Genera 2 hooks: uno para estado sync y otro para fetch async
 */

const generateUseHook = (moduleName) => `import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ${moduleName}Model } from '../models/${moduleName}Model';

/**
 * Hook para acceder al estado de ${moduleName} (solo lectura + helpers síncronos)
 */
export const use${moduleName} = () => {
  const ${moduleName.toLowerCase()}s = useSelector((state: RootState) => state.${moduleName.toLowerCase()}.list);
  const currentView = useSelector((state: RootState) => state.${moduleName.toLowerCase()}.currentView);

  /**
   * Buscar por ID
   */
  const findById = (id: number): ${moduleName}Model | undefined => {
    return ${moduleName.toLowerCase()}s.find(item => item.id === id);
  };

  /**
   * Obtener total de elementos
   */
  const getTotal = (): number => {
    return ${moduleName.toLowerCase()}s.length;
  };

  return {
    ${moduleName.toLowerCase()}s,
    currentView,
    findById,
    getTotal,
  };
};
`;

const generateUseFetchHook = (moduleName) => `import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { I${moduleName}Service } from '../services/I${moduleName}Service';
import { set${moduleName}s } from '../slices/${moduleName.toLowerCase()}Slice';

/**
 * Hook para operaciones async de ${moduleName} (fetch, create, update, delete)
 */
export const use${moduleName}Fetch = (service: I${moduleName}Service) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  /**
   * Obtener todos los elementos
   */
  const fetchAll = async (): Promise<void> => {
    const result = await service.getAll(setLoading);

    if (result.status !== 200) {
      console.error(\`❌ Error fetching ${moduleName.toLowerCase()}: [\${result.status}] \${result.message}\`);
      return;
    }

    dispatch(set${moduleName}s(result.data));
  };

  // TODO: Agregar más funciones (create, update, delete)

  return {
    loading,
    fetchAll,
  };
};
`;

export {
  generateUseHook,
  generateUseFetchHook,
};
