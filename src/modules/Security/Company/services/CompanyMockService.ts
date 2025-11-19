import { ICompanyService } from './ICompanyService';
import { CompanyModel, BranchModel } from '../models/CompanyModel';
import { ApiResponse } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';
import { MOCK_COMPANIES } from '../data/mockCompanyWithRoles';

export class CompanyMockService implements ICompanyService {
  private mockCompanies: CompanyModel[] = JSON.parse(JSON.stringify(MOCK_COMPANIES));
  private nextCompanyId = 100;
  private nextBranchId = 100;

  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<CompanyModel[]>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    return {
      status: 200,
      message: 'Compañías obtenidas exitosamente',
      data: JSON.parse(JSON.stringify(this.mockCompanies)),
    };
  }

  async create(formData: FormData, setLoading?: SetStateFn): Promise<ApiResponse<CompanyModel>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading?.(false);

    const newCompany: CompanyModel = {
      id: this.nextCompanyId++,
      name: formData.get('name') as string,
      detail: (formData.get('detail') as string) || '',
      openingDateCompany: formData.get('openingDateCompany') as string,
      phone: [
        formData.get('phoneCountryCode') as string,
        formData.get('phoneNumber') as string,
      ],
      email: formData.get('email') as string,
      logo: formData.get('logo') ? 'mock-logo-url.jpg' : '',
      timeZone: formData.get('timeZone') as string,
      companySize: formData.get('companySize') as string,
      language: formData.get('language') as string,
      active: 1,
      userId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sucursales: [],
    };

    this.mockCompanies.push(newCompany);

    return {
      status: 200,
      message: 'Compañía creada exitosamente',
      data: JSON.parse(JSON.stringify(newCompany)),
    };
  }

  async update(formData: FormData, setLoading?: SetStateFn): Promise<ApiResponse<CompanyModel>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading?.(false);

    const id = Number(formData.get('id'));
    const companyIndex = this.mockCompanies.findIndex(c => c.id === id);

    if (companyIndex === -1) {
      return {
        status: 404,
        message: 'Compañía no encontrada',
        data: {} as CompanyModel,
      };
    }

    const updatedCompany: CompanyModel = {
      ...this.mockCompanies[companyIndex],
      name: formData.get('name') as string,
      detail: (formData.get('detail') as string) || '',
      openingDateCompany: formData.get('openingDateCompany') as string,
      phone: [
        formData.get('phoneCountryCode') as string,
        formData.get('phoneNumber') as string,
      ],
      email: formData.get('email') as string,
      logo: formData.get('logo') ? 'mock-logo-url.jpg' : this.mockCompanies[companyIndex].logo,
      timeZone: formData.get('timeZone') as string,
      companySize: formData.get('companySize') as string,
      language: formData.get('language') as string,
      updatedAt: new Date().toISOString(),
    };

    this.mockCompanies[companyIndex] = updatedCompany;

    return {
      status: 200,
      message: 'Compañía actualizada exitosamente',
      data: JSON.parse(JSON.stringify(updatedCompany)),
    };
  }

  async delete(id: number, setLoading?: SetStateFn): Promise<ApiResponse<null>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    const index = this.mockCompanies.findIndex(c => c.id === id);

    if (index === -1) {
      return {
        status: 404,
        message: 'Compañía no encontrada',
        data: null,
      };
    }

    this.mockCompanies.splice(index, 1);

    return {
      status: 200,
      message: 'Compañía eliminada exitosamente',
      data: null,
    };
  }

  async addBranch(companyId: number, branchData: any, setLoading?: SetStateFn): Promise<ApiResponse<BranchModel>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setLoading?.(false);

    const company = this.mockCompanies.find(c => c.id === companyId);

    if (!company) {
      return {
        status: 404,
        message: 'Compañía no encontrada',
        data: {} as BranchModel,
      };
    }

    const newBranch: BranchModel = {
      id: this.nextBranchId++,
      name: branchData.name,
      email: branchData.email || null,
      phone: branchData.phone,
      address: branchData.address,
      lat: branchData.lat,
      lng: branchData.lng,
      active: 1,
      gblCompanyId: companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    company.sucursales.push(newBranch);

    return {
      status: 200,
      message: 'Sucursal agregada exitosamente',
      data: JSON.parse(JSON.stringify(newBranch)),
    };
  }

  async updateBranch(branchId: number, branchData: any, setLoading?: SetStateFn): Promise<ApiResponse<BranchModel>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setLoading?.(false);

    for (const company of this.mockCompanies) {
      const branchIndex = company.sucursales.findIndex(b => b.id === branchId);

      if (branchIndex !== -1) {
        const updatedBranch: BranchModel = {
          ...company.sucursales[branchIndex],
          name: branchData.name,
          email: branchData.email || null,
          phone: branchData.phone,
          address: branchData.address,
          lat: branchData.lat,
          lng: branchData.lng,
          updatedAt: new Date().toISOString(),
        };

        company.sucursales[branchIndex] = updatedBranch;

        return {
          status: 200,
          message: 'Sucursal actualizada exitosamente',
          data: JSON.parse(JSON.stringify(updatedBranch)),
        };
      }
    }

    return {
      status: 404,
      message: 'Sucursal no encontrada',
      data: {} as BranchModel,
    };
  }

  async deleteBranch(branchId: number, setLoading?: SetStateFn): Promise<ApiResponse<null>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    for (const company of this.mockCompanies) {
      const branchIndex = company.sucursales.findIndex(b => b.id === branchId);

      if (branchIndex !== -1) {
        company.sucursales.splice(branchIndex, 1);

        return {
          status: 200,
          message: 'Sucursal eliminada exitosamente',
          data: null,
        };
      }
    }

    return {
      status: 404,
      message: 'Sucursal no encontrada',
      data: null,
    };
  }
}
