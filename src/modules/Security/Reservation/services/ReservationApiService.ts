import { httpRequestWithAuth } from '@/services/httpService';
import { IReservationService } from './IReservationService';
import { ReservationModel } from '../models/ReservationModel';
import { adaptReservationArrayToReservationModels } from '../adapters/reservationAdapter';
import { ApiResponse, transformApiData } from '@/shared/types';

type SetStateFn = (loading: boolean) => void;

export class ReservationApiService implements IReservationService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<ReservationModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/api/reservation`,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptReservationArrayToReservationModels(data.data ?? [])
    );
  }
}
