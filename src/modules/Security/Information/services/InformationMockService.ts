import { IInformationService } from './IInformationService';
import { InformationModel } from '../models/InformationModel';
import { ApiResponse } from '@/shared/types';

const MOCK_INFORMATIONS: InformationModel[] = [
  { id: 1 },
  { id: 2 },
];

type SetStateFn = (loading: boolean) => void;

export class InformationMockService implements IInformationService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<InformationModel[]>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    return {
      status: 200,
      message: 'Success (mock)',
      data: MOCK_INFORMATIONS,
    };
  }
}
