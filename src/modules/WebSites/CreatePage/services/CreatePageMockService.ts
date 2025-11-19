import { ICreatePageService } from './ICreatePageService';
import { CreatePageModel } from '../models/CreatePageModel';
import { ApiResponse } from '@/shared/types';

const MOCK_CREATEPAGES: CreatePageModel[] = [
  { id: 1 },
  { id: 2 },
];

type SetStateFn = (loading: boolean) => void;

export class CreatePageMockService implements ICreatePageService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<CreatePageModel[]>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    return {
      status: 200,
      message: 'Success (mock)',
      data: MOCK_CREATEPAGES,
    };
  }
}
