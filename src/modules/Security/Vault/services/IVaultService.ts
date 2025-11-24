import { VaultModel, UserMediaModel } from '../models/VaultModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interfaz del servicio de Vault
 * Todos los métodos retornan ApiResponse<T> = { status, message, data }
 * Los errores se manejan internamente en httpService
 */
export interface IVaultService {
  /**
   * Obtiene el vault del usuario (mis imágenes + categorías del vault)
   * @returns {status: 200, message: 'Success', data: VaultModel} en éxito
   * @returns {status: 4xx/5xx, message: string, data: null} en error
   */
  getVaultData(setLoading?: SetStateFn): Promise<ApiResponse<VaultModel>>;

  /**
   * Sube una imagen o video al vault del usuario
   * @param file - Archivo (imagen o video) a subir
   * @param companyId - ID de la compañía
   * @returns Array actualizado de imágenes/videos del usuario
   */
  uploadMedia(file: File, companyId: number, setLoading?: SetStateFn): Promise<ApiResponse<UserMediaModel[]>>;

  /**
   * Elimina una imagen o video del vault
   * @param mediaId - ID de la imagen/video a eliminar
   * @returns Información de la eliminación
   */
  deleteMedia(mediaId: number, setLoading?: SetStateFn): Promise<ApiResponse<{ info: string; id: string }>>;
}
