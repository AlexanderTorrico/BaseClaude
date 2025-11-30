import { httpRequestWithAuth } from '@/services/httpService';
import { IReservationsService } from './IReservationsService';
import { ReservationsModel } from '../models/ReservationsModel';
import { adaptReservationsArrayToReservationsModels } from '../adapters/reservationsAdapter';
import { ApiResponse, transformApiData } from '@/shared/types';

type SetStateFn = (loading: boolean) => void;

export class ReservationsApiService implements IReservationsService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<ReservationsModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/reservations`,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptReservationsArrayToReservationsModels(data.data ?? [])
    );
  }
}
