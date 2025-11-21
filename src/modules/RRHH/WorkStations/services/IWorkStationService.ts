import { WorkStationModel } from '@/modules/RRHH/shared/models/WorkStationModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

export interface AddRequirementDto {
  description: string;
  workStationId: number;
}

export interface AddResponsabilityDto {
  description: string;
  workStationId: number;
}

export interface IWorkStationService {
  getWorkStationsByCompany(companyId: number, setLoading?: SetStateFn): Promise<ApiResponse<WorkStationModel[]>>;
  addRequirement(dto: AddRequirementDto, setLoading?: SetStateFn): Promise<ApiResponse<any>>;
  addResponsability(dto: AddResponsabilityDto, setLoading?: SetStateFn): Promise<ApiResponse<any>>;
}
