import { httpRequestWithAuth } from '@/services/httpService';
import { ICompanyService } from './ICompanyService';
import { CompanyModel, BranchModel } from '../models/CompanyModel';
import {
  adaptCompanyArrayToCompanyModels,
  adaptCompanyResponseToCompanyModel,
  adaptBranchResponseToBranchModel
} from '../adapters/companyAdapter';
import { ApiResponse, transformApiData } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';

export class CompanyApiService implements ICompanyService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<CompanyModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/api/gbl-company`,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptCompanyArrayToCompanyModels(data.data ?? [])
    );
  }

  async create(formData: FormData, setLoading?: SetStateFn): Promise<ApiResponse<CompanyModel>> {
    const res = await httpRequestWithAuth.postFormData<ApiResponse<any>>(
      '/company',
      formData,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptCompanyResponseToCompanyModel(data.data)
    );
  }

  async update(formData: FormData, setLoading?: SetStateFn): Promise<ApiResponse<CompanyModel>> {
    const res = await httpRequestWithAuth.postFormData<ApiResponse<any>>(
      `/api/gbl-company3/update`,
      formData,
      setLoading
    );

    return transformApiData(res, (data) => {
      // La respuesta puede venir en data.data o directamente en data
      const companyData = data.data || data;
      return adaptCompanyResponseToCompanyModel(companyData);
    });
  }

  async delete(id: number, setLoading?: SetStateFn): Promise<ApiResponse<null>> {
    const res = await httpRequestWithAuth.delete<ApiResponse<any>>(
      `/company/${id}`,
      setLoading
    );

    return {
      status: res.status,
      message: res.message,
      data: null,
    };
  }

  async addBranch(companyId: number, branchData: any, setLoading?: SetStateFn): Promise<ApiResponse<BranchModel>> {
    const res = await httpRequestWithAuth.post<ApiResponse<any>>(
      `/company/${companyId}/branch`,
      branchData,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptBranchResponseToBranchModel(data.data)
    );
  }

  async updateBranch(branchId: number, branchData: any, setLoading?: SetStateFn): Promise<ApiResponse<BranchModel>> {
    const res = await httpRequestWithAuth.put<ApiResponse<any>>(
      `/company/branch/${branchId}`,
      branchData,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptBranchResponseToBranchModel(data.data)
    );
  }

  async deleteBranch(branchId: number, setLoading?: SetStateFn): Promise<ApiResponse<null>> {
    const res = await httpRequestWithAuth.delete<ApiResponse<any>>(
      `/company/branch/${branchId}`,
      setLoading
    );

    return {
      status: res.status,
      message: res.message,
      data: null,
    };
  }
}
