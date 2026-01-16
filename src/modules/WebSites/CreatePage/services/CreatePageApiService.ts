import axios from 'axios';
import { httpRequestWithAuth } from '@/services/httpService';
import { ICreatePageService } from './ICreatePageService';
import { CreatePageModel } from '../models/CreatePageModel';
import { TemplateModel } from '../models/TemplateModel';
import { GeneratePageDto } from '../models/GeneratePageDto';
import { GenerateWithAIDto } from '../models/GenerateWithAIDto';
import { adaptCreatePageArrayToCreatePageModels } from '../adapters/createpageAdapter';
import { adaptTemplateArrayToModels } from '../adapters/templateAdapter';
import { ApiResponse, transformApiData } from '@/shared/types';

type SetStateFn = (loading: boolean) => void;

export class CreatePageApiService implements ICreatePageService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<CreatePageModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/createpage`,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptCreatePageArrayToCreatePageModels(data.data ?? [])
    );
  }

  /**
   * Obtiene todos los templates de páginas
   */
  async getTemplates(setLoading?: SetStateFn): Promise<ApiResponse<TemplateModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/api/dsg-t-page`,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptTemplateArrayToModels(data.data ?? data ?? [])
    );
  }

  /**
   * Genera una nueva página a partir de un template
   */
  async generatePage(dto: GeneratePageDto, setLoading?: SetStateFn): Promise<ApiResponse<any>> {
    const res = await httpRequestWithAuth.post<ApiResponse<any>>(
      `/api/dsg-page/generate`,
      dto,
      setLoading
    );

    return res;
  }

  /**
   * Genera una nueva página usando IA
   * Usa un timeout largo (5 minutos) porque la IA puede tardar
   */
  async generateWithAI(dto: GenerateWithAIDto, setLoading?: SetStateFn): Promise<ApiResponse<any>> {
    setLoading?.(true);

    try {
      const token = localStorage.getItem('authToken');
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.post(
        `${baseURL}/api/dsg-page/generate_public`,
        dto,
        {
          timeout: 300000, // 5 minutos de timeout
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      setLoading?.(false);
      return {
        status: response.status,
        message: 'Success',
        data: response.data,
      };
    } catch (error: any) {
      setLoading?.(false);
      console.error('[AI Generation Error]', error);
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.message || 'Request failed',
        data: null,
      };
    }
  }
}
