import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IMyPagesService } from '../services/IMyPagesService';
import { setMyPagess, updateMyPagesName } from '../slices/mypagesSlice';
import { toast } from 'react-toastify';

/**
 * Hook para operaciones async de MyPages (fetch, create, update, delete)
 */
export const useMyPagesFetch = (service: IMyPagesService) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  /**
   * Obtener todos los elementos
   */
  const fetchAll = async (): Promise<void> => {
    const result = await service.getAll(setLoading);

    if (result.status !== 200) {
      console.error(`Error fetching mypages: [${result.status}] ${result.message}`);
      toast.error(result.message || 'Error al cargar las páginas');
      return;
    }

    dispatch(setMyPagess(result.data));
  };

  /**
   * Actualizar nombre de una página
   */
  const updatePageName = async (pageId: number, newName: string): Promise<{ success: boolean; message: string }> => {
    if (!newName.trim()) {
      toast.error('El nombre no puede estar vacío');
      return { success: false, message: 'El nombre no puede estar vacío' };
    }

    const result = await service.updatePageName(pageId, newName, setLoading);

    if (result.status !== 200 || !result.data) {
      toast.error(result.message || 'Error al actualizar el nombre');
      return { success: false, message: result.message || 'Error al actualizar el nombre' };
    }

    // Actualización parcial - solo el nombre
    dispatch(updateMyPagesName({ id: result.data.id, name: result.data.name }));
    toast.success('Nombre actualizado exitosamente');
    return { success: true, message: result.message };
  };

  // TODO: Agregar más funciones (create, delete)

  return {
    loading,
    fetchAll,
    updatePageName,
  };
};
