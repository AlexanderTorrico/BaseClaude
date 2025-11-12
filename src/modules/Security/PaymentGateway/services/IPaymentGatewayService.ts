import { PaymentGatewayModel } from '../models/PaymentGatewayModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interfaz del servicio de PaymentGateway
 * Todos los métodos retornan ApiResponse<T> = { status, message, data }
 * Los errores se manejan internamente en httpService
 */
export interface IPaymentGatewayService {
  /**
   * Obtiene todos los paymentgateways
   * @returns {status: 200, message: 'Success', data: PaymentGatewayModel[]} en éxito
   * @returns {status: 4xx/5xx, message: string, data: []} en error
   */
  getAll(setLoading?: SetStateFn): Promise<ApiResponse<PaymentGatewayModel[]>>;
}
