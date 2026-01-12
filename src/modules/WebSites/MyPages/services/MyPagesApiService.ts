import { httpRequestWithAuth } from '@/services/httpService';
import { IMyPagesService } from './IMyPagesService';
import { MyPagesModel } from '../models/MyPagesModel';
import { adaptMyPagesArrayToMyPagesModels } from '../adapters/mypagesAdapter';
import { ApiResponse } from '@/shared/types';

type SetStateFn = (loading: boolean) => void;

export class MyPagesApiService implements IMyPagesService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<MyPagesModel[]>> {
    // Usar el endpoint que filtra por compañía del usuario
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/api/dsg-page/company`,
      setLoading
    );

    // El httpService retorna { status, message, data }
    // Pero res.data ES OTRO { status, message, data }
    // Entonces necesitamos res.data.data para obtener el array real
    const arrayData = res.data?.data ?? res.data ?? [];

    return {
      status: res.status,
      message: res.message,
      data: adaptMyPagesArrayToMyPagesModels(arrayData)
    };
  }

  async updatePageName(pageId: number, newName: string, setLoading?: SetStateFn): Promise<ApiResponse<MyPagesModel | null>> {
    const res = await httpRequestWithAuth.put<ApiResponse<any>>(
      `/api/dsg_page_name`,
      {
        page_id: pageId,
        name: newName
      },
      setLoading
    );

    if (res.status !== 200) {
      return {
        status: res.status,
        message: res.message || 'Error al actualizar el nombre',
        data: null,
      };
    }

    // El API retorna { status, message, data: { id, name } }
    // Solo actualizamos el nombre en el modelo existente
    const updatedData = res.data?.data ?? res.data;

    if (!updatedData) {
      return {
        status: 500,
        message: 'No se recibieron datos del servidor',
        data: null,
      };
    }

    // Necesitamos el modelo completo para Redux, así que tomamos solo id y name
    // y el hook debe manejar la actualización parcial
    return {
      status: res.status,
      message: res.message || 'Nombre actualizado exitosamente',
      data: {
        id: updatedData.id,
        name: updatedData.name,
      } as any // Retornamos solo los campos actualizados
    };
  }
}
