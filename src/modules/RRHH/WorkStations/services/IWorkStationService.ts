import { WorkStationModel } from '../models/WorkStationModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';


export interface IWorkStationService {
  
  getWorkStationsByCompany( companyId: number, setLoading?: SetStateFn): Promise<ApiResponse<WorkStationModel[]>>;
  
}
