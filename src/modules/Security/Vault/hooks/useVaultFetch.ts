import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IVaultService } from '../services/IVaultService';
import { setVaultData, addPendingUpload, removePendingUpload } from '../slices/vaultSlice';
import { toast } from 'react-toastify';

/**
 * Hook para operaciones async de Vault (fetch vault data)
 */
export const useVaultFetch = (service: IVaultService) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  /**
   * Obtener datos del vault (mis imágenes + categorías)
   */
  const fetchVaultData = async (): Promise<void> => {
    const result = await service.getVaultData(setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error fetching vault: [${result.status}] ${result.message}`);
      return;
    }

    dispatch(setVaultData(result.data));
  };

  /**
   * Subir imagen o video al vault
   */
  const uploadMedia = async (file: File, isVideo: boolean): Promise<{ success: boolean; message: string }> => {
    const companyId = 1; // TODO: Obtener desde el contexto del usuario

    // Crear un ID único para este upload
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Agregar el pending upload ANTES de hacer la petición
    dispatch(addPendingUpload({
      id: uploadId,
      fileName: file.name,
      isVideo,
      timestamp: Date.now(),
    }));

    const result = await service.uploadMedia(file, companyId, setLoading);

    // Remover el pending upload después de la petición
    dispatch(removePendingUpload(uploadId));

    if (result.status !== 200) {
      const errorMsg = result.message || 'Error al subir el archivo';
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }

    // Actualizar el vault completo después del upload exitoso
    await fetchVaultData();

    const successMsg = `${isVideo ? 'Video' : 'Imagen'} subido exitosamente`;
    toast.success(successMsg);
    return { success: true, message: successMsg };
  };

  /**
   * Eliminar imagen o video del vault
   */
  const deleteMedia = async (mediaId: number): Promise<{ success: boolean; message: string }> => {
    const result = await service.deleteMedia(mediaId, setLoading);

    if (result.status !== 200) {
      const errorMsg = result.message || 'Error al eliminar el archivo';
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }

    // Actualizar el vault completo después del delete exitoso
    await fetchVaultData();

    const successMsg = 'Multimedia eliminada exitosamente';
    toast.success(successMsg);
    return { success: true, message: successMsg };
  };

  return {
    loading,
    fetchVaultData,
    uploadMedia,
    deleteMedia,
  };
};
