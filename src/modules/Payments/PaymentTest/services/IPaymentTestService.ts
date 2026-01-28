import { ApiResponse } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';
import {
  TestTransactionModel,
  CreateTestOrderDto,
  CaptureOrderDto,
  OrderStatusDto,
  TransactionFilters,
  TransactionStats,
  CreateOrderApiResponse,
  CaptureOrderApiResponse,
  OrderStatusApiResponse,
} from '../models/PaymentTestModel';
import { PaymentConfigModel } from '../../Paymentmethods/models/PaymentmethodsModel';

/**
 * Interfaz del servicio de pruebas de pago
 */
export interface IPaymentTestService {
  /**
   * Obtener configuraciones de PayPal activas para la empresa
   */
  getPayPalConfigs(setLoading?: SetStateFn): Promise<ApiResponse<PaymentConfigModel[]>>;

  /**
   * Crear una orden de pago de prueba
   */
  createTestOrder(
    dto: CreateTestOrderDto,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<CreateOrderApiResponse>>;

  /**
   * Capturar una orden de pago
   */
  captureOrder(
    dto: CaptureOrderDto,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<CaptureOrderApiResponse>>;

  /**
   * Consultar estado de una orden
   */
  getOrderStatus(
    dto: OrderStatusDto,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<OrderStatusApiResponse>>;

  /**
   * Obtener historial de transacciones de prueba
   */
  getTransactions(
    filters?: TransactionFilters,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<TestTransactionModel[]>>;

  /**
   * Obtener estadísticas de transacciones
   */
  getStats(setLoading?: SetStateFn): Promise<ApiResponse<TransactionStats>>;

  /**
   * Obtener una transacción por UUID
   */
  getTransaction(uuid: string, setLoading?: SetStateFn): Promise<ApiResponse<TestTransactionModel>>;
}
