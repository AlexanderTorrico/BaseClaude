import { httpRequestWithAuth } from '@/services/httpService';
import { ICompanyService } from './ICompanyService';
import { CompanyModel } from '../models/CompanyModel';
import { adaptCompanyArrayToCompanyModels } from '../adapters/companyAdapter';
import { ApiResponse, transformApiData } from '@/shared/types';

type SetStateFn = (loading: boolean) => void;

export class CompanyApiService implements ICompanyService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<CompanyModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/company`,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptCompanyArrayToCompanyModels(data.data ?? [])
    );
  }
}
