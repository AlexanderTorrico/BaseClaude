import { ICompanyService } from './ICompanyService';
import { CompanyModel, Branch } from '../models/CompanyModel';
import { ApiResponse } from '@/shared/types';
import { MOCK_COMPANY, MOCK_BRANCHES } from '../data/mockCompany';

type SetStateFn = (loading: boolean) => void;

export class CompanyMockService implements ICompanyService {
  private company: CompanyModel = { ...MOCK_COMPANY };
  private branches: Branch[] = [...MOCK_BRANCHES];
  private nextBranchId: number = 10;

  async getCompany(setLoading?: SetStateFn): Promise<ApiResponse<CompanyModel>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    return {
      status: 200,
      message: 'Compañía obtenida exitosamente (mock)',
      data: { ...this.company, branches: [...this.branches] },
    };
  }

  async updateCompany(
    data: Partial<CompanyModel>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<CompanyModel>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading?.(false);

    this.company = {
      ...this.company,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      status: 200,
      message: 'Compañía actualizada exitosamente (mock)',
      data: { ...this.company },
    };
  }

  async getBranches(setLoading?: SetStateFn): Promise<ApiResponse<Branch[]>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    setLoading?.(false);

    return {
      status: 200,
      message: 'Sucursales obtenidas exitosamente (mock)',
      data: [...this.branches],
    };
  }

  async createBranch(
    data: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<Branch>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setLoading?.(false);

    const newBranch: Branch = {
      ...data,
      id: this.nextBranchId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.branches.push(newBranch);

    return {
      status: 200,
      message: 'Sucursal creada exitosamente (mock)',
      data: newBranch,
    };
  }

  async updateBranch(
    id: number,
    data: Partial<Branch>,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<Branch>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setLoading?.(false);

    const index = this.branches.findIndex(b => b.id === id);
    if (index === -1) {
      return {
        status: 404,
        message: 'Sucursal no encontrada (mock)',
        data: null as any,
      };
    }

    this.branches[index] = {
      ...this.branches[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      status: 200,
      message: 'Sucursal actualizada exitosamente (mock)',
      data: this.branches[index],
    };
  }

  async deleteBranch(id: number, setLoading?: SetStateFn): Promise<ApiResponse<boolean>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    const index = this.branches.findIndex(b => b.id === id);
    if (index === -1) {
      return {
        status: 404,
        message: 'Sucursal no encontrada (mock)',
        data: false,
      };
    }

    this.branches.splice(index, 1);

    return {
      status: 200,
      message: 'Sucursal eliminada exitosamente (mock)',
      data: true,
    };
  }
}
