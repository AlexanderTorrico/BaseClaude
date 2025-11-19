import { httpRequestWithAuth } from '@/services/httpService';
import { ICreatePageService } from './ICreatePageService';
import { CreatePageModel } from '../models/CreatePageModel';
import { adaptCreatePageArrayToCreatePageModels } from '../adapters/createpageAdapter';
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
}
