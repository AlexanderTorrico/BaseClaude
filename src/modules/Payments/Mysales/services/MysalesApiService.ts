import { httpRequestWithAuth } from '@/services/httpService';
import { IMysalesService } from './IMysalesService';
import { MysalesModel } from '../models/MysalesModel';
import { adaptMysalesArrayToMysalesModels } from '../adapters/mysalesAdapter';
import { ApiResponse, transformApiData } from '@/shared/types';

type SetStateFn = (loading: boolean) => void;

export class MysalesApiService implements IMysalesService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<MysalesModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/mysales`,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptMysalesArrayToMysalesModels(data.data ?? [])
    );
  }
}
