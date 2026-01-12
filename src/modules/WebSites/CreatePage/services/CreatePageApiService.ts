import { httpRequestWithAuth } from '@/services/httpService';
import { ICreatePageService } from './ICreatePageService';
import { CreatePageModel } from '../models/CreatePageModel';
import { TemplateModel } from '../models/TemplateModel';
import { GeneratePageDto } from '../models/GeneratePageDto';
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
}


