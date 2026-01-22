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

  async convertToTemplate(
    pageId: number,
    templateName: string,
    templateDescription: string,
    categoryId: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<any>> {
    // Build payload - only include description if it has a value
    const payload: any = {
      page_id: pageId,
      template_name: templateName,
      category_id: categoryId
    };

    // Only add description if provided
    if (templateDescription && templateDescription.trim()) {
      payload.template_description = templateDescription.trim();
    }

    const res = await httpRequestWithAuth.post<ApiResponse<any>>(
      `/api/dsg-page/convert-to-template`,
      payload,
      setLoading
    );

    return {
      status: res.status,
      message: res.message || (res.status === 200 || res.status === 201 ? 'Template created successfully' : 'Error creating template'),
      data: res.data?.data ?? res.data
    };
  }

  async getPreviewUrl(
    viewKey: string,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<string>> {
    const res = await httpRequestWithAuth.post<ApiResponse<any>>(
      `/api/dsg-page/preview_`,
      { view_key: viewKey },
      setLoading
    );

    // The API should return a URL or the data to construct the URL
    const responseData = res.data as any;
    const previewUrl = responseData?.data?.url ?? responseData?.url ?? responseData?.data ?? responseData;

    return {
      status: res.status,
      message: res.message,
      data: typeof previewUrl === 'string' ? previewUrl : ''
    };
  }
}
