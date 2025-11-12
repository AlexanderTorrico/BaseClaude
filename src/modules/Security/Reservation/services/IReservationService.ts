import { ReservationModel } from '../models/ReservationModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interfaz del servicio de Reservation
 * Todos los métodos retornan ApiResponse<T> = { status, message, data }
 * Los errores se manejan internamente en httpService
 */
export interface IReservationService {
  /**
   * Obtiene todos los reservations
   * @returns {status: 200, message: 'Success', data: ReservationModel[]} en éxito
   * @returns {status: 4xx/5xx, message: string, data: []} en error
   */
  getAll(setLoading?: SetStateFn): Promise<ApiResponse<ReservationModel[]>>;
}
