import { IReservationService } from './IReservationService';
import { ReservationModel } from '../models/ReservationModel';
import { ApiResponse } from '@/shared/types';

const MOCK_RESERVATIONS: ReservationModel[] = [
  { id: 1 },
  { id: 2 },
];

type SetStateFn = (loading: boolean) => void;

export class ReservationMockService implements IReservationService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<ReservationModel[]>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    return {
      status: 200,
      message: 'Success (mock)',
      data: MOCK_RESERVATIONS,
    };
  }
}
