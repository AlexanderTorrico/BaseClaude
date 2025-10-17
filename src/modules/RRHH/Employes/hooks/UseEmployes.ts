import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { EmployesController } from '../controllers/EmployesController';
import { ControllerResponse } from '@/shared/controllers/ControllerResponse';

/**
 * Hook personalizado para Employes
 * - Lee del Redux (sync)
 * - Llama al Controller para operaciones async (con caché inteligente)
 * - La UI solo se comunica con este hook
 */
export const useEmployes = () => {
  const data = useSelector((state: RootState) => state.employes.data);
  const loading = useSelector((state: RootState) => state.employes.loading);
  const error = useSelector((state: RootState) => state.employes.error);

  // ==========================================
  // FUNCIONES ASÍNCRONAS (con caché inteligente)
  // ==========================================

  /**
   * Obtener datos
   * Si ya hay datos en Redux, no hace la petición (caché)
   * Para forzar recarga, usar force: true
   */
  const fetchData = async (
    options?: { force?: boolean }
  ): Promise<ControllerResponse<any>> => {
    // Si ya hay datos y no se fuerza la recarga, usa caché
    if (data && data.length > 0 && !options?.force) {
      console.log('📦 Usando datos en caché');
      return {
        loading: false,
        data,
        success: true
      };
    }

    // Si no hay datos o se fuerza, llama al Controller
    console.log('🌐 Llamando al Controller...');
    return await EmployesController.getData();
  };

  // ==========================================
  // FUNCIONES SÍNCRONAS (lógica de negocio local)
  // ==========================================

  /**
   * Obtener total de items (sincrónico)
   */
  const getTotalItems = (): number => {
    return data?.length || 0;
  };

  return {
    // Estado de Redux
    data,
    loading,
    error,

    // Funciones async (con caché)
    fetchData,

    // Funciones sync (lógica local)
    getTotalItems
  };
};
