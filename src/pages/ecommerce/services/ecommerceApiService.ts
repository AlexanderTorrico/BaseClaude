import { httpRequestWithAuth } from '@/services/httpService';
import { IecommerceService } from './IecommerceService';
import { ecommerceModel } from '../models/ecommerceModel';
import { adaptecommerceArrayToecommerceModels } from '../adapters/ecommerceAdapter';
import { ApiResponse, transformApiData } from '@/shared/types';

type SetStateFn = (loading: boolean) => void;

export class ecommerceApiService implements IecommerceService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<ecommerceModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/ecommerce`,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptecommerceArrayToecommerceModels(data.data ?? [])
    );
  }
}
