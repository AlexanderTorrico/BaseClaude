import { IecommerceService } from './IecommerceService';
import { ecommerceModel } from '../models/ecommerceModel';
import { ApiResponse } from '@/shared/types';

const MOCK_ECOMMERCES: ecommerceModel[] = [
  { id: 1 },
  { id: 2 },
];

type SetStateFn = (loading: boolean) => void;

export class ecommerceMockService implements IecommerceService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<ecommerceModel[]>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    return {
      status: 200,
      message: 'Success (mock)',
      data: MOCK_ECOMMERCES,
    };
  }
}
