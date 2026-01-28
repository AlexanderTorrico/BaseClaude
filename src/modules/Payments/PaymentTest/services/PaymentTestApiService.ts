import { httpRequestWithAuth } from '@/services/httpService';
import { IPaymentTestService } from './IPaymentTestService';
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
  TransactionApiResponse,
} from '../models/PaymentTestModel';
import { PaymentConfigModel, PayCompanyPaymentConfigApiResponse } from '../../Paymentmethods/models/PaymentmethodsModel';
import { adaptTransactionToModel, adaptTransactionsToModels } from '../adapters/paymentTestAdapter';
import { ApiResponse } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';

/**
 * Respuesta del backend Laravel
 */
interface BackendResponse<T> {
  status: number;
  message: string;
  data: T;
}

/**
 * Helper para extraer datos del backend
 */
const extractBackendData = <T, R>(
  httpResponse: ApiResponse<BackendResponse<T>>,
  transform: (data: T) => R
): ApiResponse<R> => {
  const backendResponse = httpResponse.data;

  if (!backendResponse) {
    return {
      status: httpResponse.status,
      message: httpResponse.message || 'Error de conexión',
      data: null as unknown as R,
    };
  }

  const backendStatus = backendResponse.status ?? httpResponse.status;
  const isError = backendStatus >= 400;

  if (isError) {
    return {
      status: backendStatus,
      message: backendResponse.message || 'Error en la operación',
      data: null as unknown as R,
    };
  }

  if (!backendResponse.data) {
    return {
      status: backendStatus,
      message: backendResponse.message ?? httpResponse.message,
      data: null as unknown as R,
    };
  }

  return {
    status: backendStatus,
    message: backendResponse.message ?? httpResponse.message,
    data: transform(backendResponse.data),
  };
};

/**
 * Adaptar configuración de PayPal del API
 */
const adaptPayConfigToModel = (api: PayCompanyPaymentConfigApiResponse): PaymentConfigModel => ({
  uuid: api.uuid,
  companyId: api.gbl_company_id,
  paymentMethodId: api.pay_method_id,
  paymentMethod: api.pay_method ? {
    id: api.pay_method.id,
    code: api.pay_method.code,
    name: api.pay_method.name,
    description: api.pay_method.description,
    type: 'digital_wallet',
    provider: 'paypal',
    icon: api.pay_method.icon || '',
    image: api.pay_method.image,
    color: '#003087',
    requiresCredentials: true,
    credentialFields: api.credential_fields,
    settingsFields: api.settings_fields,
    supportedCurrencies: ['EUR', 'USD', 'GBP'],
    defaultCommissionPercentage: 2.9,
    defaultFixedCommission: 0.30,
  } : null,
  settings: api.settings,
  mode: api.mode,
  brandName: api.brand_name,
  defaultCurrency: api.default_currency,
  isActive: api.is_active,
  isVerified: api.is_verified,
  verifiedAt: api.verified_at,
  hasCredentials: api.has_credentials,
  credentialFields: api.credential_fields,
  settingsFields: api.settings_fields,
  createdAt: api.created_at,
  updatedAt: api.updated_at,
});

/**
 * Servicio API para pruebas de PayPal
 */
export class PaymentTestApiService implements IPaymentTestService {
  private companyId: number;

  constructor(companyId: number) {
    this.companyId = companyId;
  }

  /**
   * Obtener configuraciones de PayPal activas
   */
  async getPayPalConfigs(setLoading?: SetStateFn): Promise<ApiResponse<PaymentConfigModel[]>> {
    const res = await httpRequestWithAuth.get<BackendResponse<PayCompanyPaymentConfigApiResponse[]>>(
      `/api/payment-config/company/${this.companyId}/active`,
      setLoading
    );

    return extractBackendData(res, (data) =>
      (data ?? [])
        .filter(config => config.pay_method?.code === 'paypal')
        .map(adaptPayConfigToModel)
    );
  }

  /**
   * Crear una orden de pago de prueba
   */
  async createTestOrder(
    dto: CreateTestOrderDto,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<CreateOrderApiResponse>> {
    const res = await httpRequestWithAuth.post<BackendResponse<CreateOrderApiResponse>>(
      `/api/payment-test/create-order`,
      {
        ...dto,
        gbl_company_id: this.companyId,
      },
      setLoading
    );

    return extractBackendData(res, (data) => data);
  }

  /**
   * Capturar una orden de pago
   */
  async captureOrder(
    dto: CaptureOrderDto,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<CaptureOrderApiResponse>> {
    const res = await httpRequestWithAuth.post<BackendResponse<CaptureOrderApiResponse>>(
      `/api/payment-test/capture-order`,
      {
        ...dto,
        gbl_company_id: this.companyId,
      },
      setLoading
    );

    return extractBackendData(res, (data) => data);
  }

  /**
   * Consultar estado de una orden
   */
  async getOrderStatus(
    dto: OrderStatusDto,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<OrderStatusApiResponse>> {
    const res = await httpRequestWithAuth.post<BackendResponse<OrderStatusApiResponse>>(
      `/api/payment-test/order-status`,
      {
        ...dto,
        gbl_company_id: this.companyId,
      },
      setLoading
    );

    return extractBackendData(res, (data) => data);
  }

  /**
   * Obtener historial de transacciones de prueba
   */
  async getTransactions(
    filters?: TransactionFilters,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<TestTransactionModel[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.from_date) params.append('from_date', filters.from_date);
    if (filters?.to_date) params.append('to_date', filters.to_date);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());

    const queryString = params.toString();
    const url = `/api/payment-test/transactions/${this.companyId}${queryString ? `?${queryString}` : ''}`;

    const res = await httpRequestWithAuth.get<BackendResponse<TransactionApiResponse[]>>(
      url,
      setLoading
    );

    return extractBackendData(res, (data) => adaptTransactionsToModels(data ?? []));
  }

  /**
   * Obtener estadísticas de transacciones
   */
  async getStats(setLoading?: SetStateFn): Promise<ApiResponse<TransactionStats>> {
    const res = await httpRequestWithAuth.get<BackendResponse<TransactionStats>>(
      `/api/payment-test/transactions/${this.companyId}/stats`,
      setLoading
    );

    return extractBackendData(res, (data) => data);
  }

  /**
   * Obtener una transacción por UUID
   */
  async getTransaction(
    uuid: string,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<TestTransactionModel>> {
    const res = await httpRequestWithAuth.get<BackendResponse<TransactionApiResponse>>(
      `/api/payment-test/transaction/${uuid}`,
      setLoading
    );

    return extractBackendData(res, (data) => adaptTransactionToModel(data));
  }

  /**
   * Actualizar el companyId
   */
  setCompanyId(companyId: number): void {
    this.companyId = companyId;
  }
}

/**
 * Factory function para crear instancia del servicio
 */
export const createPaymentTestApiService = (companyId: number): PaymentTestApiService => {
  return new PaymentTestApiService(companyId);
};
