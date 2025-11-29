import { ReservationsModel } from '../models/ReservationsModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interfaz del servicio de Reservations
 * Todos los métodos retornan ApiResponse<T> = { status, message, data }
 * Los errores se manejan internamente en httpService
 */
export interface IReservationsService {
  /**
   * Obtiene todos los reservationss
   * @returns {status: 200, message: 'Success', data: ReservationsModel[]} en éxito
   * @returns {status: 4xx/5xx, message: string, data: []} en error
   */
  getAll(setLoading?: SetStateFn): Promise<ApiResponse<ReservationsModel[]>>;
}
