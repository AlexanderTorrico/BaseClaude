import { httpRequestWithAuth } from '@/services/httpService';
import { IVaultService } from './IVaultService';
import { VaultModel, UserMediaModel } from '../models/VaultModel';
import { adaptVaultResponseToVaultModel, adaptUserMediaResponseToModel } from '../adapters/vaultAdapter';
import { ApiResponse } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';

/**
 * Implementación del servicio Vault usando la API real
 */
export class VaultApiService implements IVaultService {
  /**
   * Obtiene el vault de la compañía (mis imágenes + categorías)
   * Endpoint: GET /api/gbl-image/company/{companyId}
   */
  async getVaultData(setLoading?: SetStateFn): Promise<ApiResponse<VaultModel>> {
    const companyId = 1; // TODO: Obtener desde el contexto del usuario
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/api/gbl-image/company/${companyId}`,
      setLoading
    );

    // El API devuelve: { status, message, data: { status, message, data: { my_images, my_videos, vaul } } }
    // Necesitamos acceder a res.data.data para obtener my_images, my_videos, vaul
    const rawData = res.data?.data || res.data; // Fallback por si cambia la estructura
    const adaptedData = adaptVaultResponseToVaultModel(rawData);

    return {
      status: res.status,
      message: res.message,
      data: adaptedData,
    };
  }

  /**
   * Sube una imagen o video al vault
   * Endpoint: POST /api/gbl-image/upload
   */
  async uploadMedia(file: File, companyId: number, setLoading?: SetStateFn): Promise<ApiResponse<UserMediaModel[]>> {
    const formData = new FormData();
    formData.append('media', file);
    formData.append('company_id', companyId.toString());

    const res = await httpRequestWithAuth.postFormData<ApiResponse<any>>(
      `/api/gbl-image/upload`,
      formData,
      setLoading
    );

    // El API devuelve: { status, message, data: [{ id, url, type }, ...] }
    // Transformar el array de respuesta a UserMediaModel[]
    const rawData = res.data?.data || res.data;
    const adaptedData = Array.isArray(rawData)
      ? rawData.map(adaptUserMediaResponseToModel)
      : [];

    return {
      status: res.status,
      message: res.message,
      data: adaptedData,
    };
  }

  /**
   * Elimina una imagen o video del vault
   * Endpoint: POST /api/gbl-image/delete
   */
  async deleteMedia(mediaId: number, setLoading?: SetStateFn): Promise<ApiResponse<{ info: string; id: string }>> {
    const formData = new FormData();
    formData.append('id', mediaId.toString());

    const res = await httpRequestWithAuth.postFormData<ApiResponse<any>>(
      `/api/gbl-image/delete`,
      formData,
      setLoading
    );

    // El API devuelve: { status, message, data: { info: "Image deleted", id: "3" } }
    const deleteInfo = res.data?.data || res.data;

    return {
      status: res.status,
      message: res.message,
      data: deleteInfo,
    };
  }
}
