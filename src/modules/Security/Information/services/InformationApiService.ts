import { httpRequestWithAuth } from '@/services/httpService';
import { IInformationService } from './IInformationService';
import { InformationModel } from '../models/InformationModel';
import { adaptInformationArrayToInformationModels } from '../adapters/informationAdapter';
import { ApiResponse, transformApiData } from '@/shared/types';

type SetStateFn = (loading: boolean) => void;

export class InformationApiService implements IInformationService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<InformationModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/information`,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptInformationArrayToInformationModels(data.data ?? [])
    );
  }
}
