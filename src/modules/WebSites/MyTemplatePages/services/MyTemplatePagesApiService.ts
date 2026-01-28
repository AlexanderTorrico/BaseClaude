import { httpRequestWithAuth } from '@/services/httpService';
import { IMyTemplatePagesService } from './IMyTemplatePagesService';
import { MyTemplatePagesModel, TemplateStatus } from '../models/MyTemplatePagesModel';
import { adaptMyTemplatePagesArrayToMyTemplatePagesModels, adaptMyTemplatePagesResponseToMyTemplatePagesModel } from '../adapters/mytemplatepagesAdapter';
import { ApiResponse, transformApiData } from '@/shared/types';

type SetStateFn = (loading: boolean) => void;

export class MyTemplatePagesApiService implements IMyTemplatePagesService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<MyTemplatePagesModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/api/my-templates`,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptMyTemplatePagesArrayToMyTemplatePagesModels(data.data ?? [])
    );
  }

  async updateStatus(id: number, status: TemplateStatus, setLoading?: SetStateFn): Promise<ApiResponse<MyTemplatePagesModel>> {
    const res = await httpRequestWithAuth.put<ApiResponse<any>>(
      `/api/my-templates/${id}/status`,
      { status },
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptMyTemplatePagesResponseToMyTemplatePagesModel(data.data ?? data)
    );
  }
}
