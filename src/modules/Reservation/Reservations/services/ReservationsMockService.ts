import { IReservationsService } from './IReservationsService';
import { ReservationsModel } from '../models/ReservationsModel';
import { ApiResponse } from '@/shared/types';

const MOCK_RESERVATIONSS: ReservationsModel[] = [
  { id: 1 },
  { id: 2 },
];

type SetStateFn = (loading: boolean) => void;

export class ReservationsMockService implements IReservationsService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<ReservationsModel[]>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    return {
      status: 200,
      message: 'Success (mock)',
      data: MOCK_RESERVATIONSS,
    };
  }
}
