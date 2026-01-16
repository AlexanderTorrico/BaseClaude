import { httpRequestWithAuth } from '@/services/httpService';
import { IPaymentmethodsService } from './IPaymentmethodsService';
import {
  PaymentMethodModel,
  PaymentAccountModel,
  CreatePaymentAccountDto,
  UpdatePaymentAccountDto,
  PayMethodApiResponse,
  PayCompanyPaymentConfigApiResponse,
  CreatePaymentConfigDto,
  UpdatePaymentConfigDto,
  TestConnectionResponse,
} from '../models/PaymentmethodsModel';
import {
  adaptPayMethodsArrayToPaymentMethodModels,
  adaptPayConfigsToPaymentAccountModels,
  adaptPayConfigToPaymentAccountModel,
  adaptCreateAccountDtoToApiFormat,
  adaptUpdateAccountDtoToApiFormat,
} from '../adapters/paymentmethodsAdapter';
import { ApiResponse } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';

/**
 * Respuesta del backend Laravel (Resp class)
 * El backend siempre devuelve HTTP 200, el status real está en el body
 */
interface BackendResponse<T> {
  status: number;
  message: string;
  data: T;
}

/**
 * Helper para formatear errores de validación del backend
 * El backend puede devolver data como array de strings con errores
 */
const formatValidationErrors = (data: unknown, defaultMessage: string): string => {
  if (Array.isArray(data) && data.length > 0) {
    // Si data es un array de strings, unirlos con saltos de línea
    return data.join('\n');
  }
  return defaultMessage;
};

/**
 * Helper para extraer y transformar la respuesta del backend
 */
const extractBackendData = <T, R>(
  httpResponse: ApiResponse<BackendResponse<T>>,
  transform: (data: T) => R
): ApiResponse<R> => {
  const backendResponse = httpResponse.data;

  // Si hay error de red o no hay respuesta del backend
  if (!backendResponse) {
    return {
      status: httpResponse.status,
      message: httpResponse.message || 'Error de conexión',
      data: null as unknown as R,
    };
  }

  const backendStatus = backendResponse.status ?? httpResponse.status;
  const isError = backendStatus >= 400;

  // Si hay error (validación u otro), formatear el mensaje con los detalles
  if (isError) {
    const errorMessage = formatValidationErrors(
      backendResponse.data,
      backendResponse.message || 'Error en la operación'
    );
    return {
      status: backendStatus,
      message: errorMessage,
      data: null as unknown as R,
    };
  }

  // Si no hay datos en respuesta exitosa
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
 * Servicio API para métodos de pago
 * Conecta con los endpoints del backend Laravel
 */
export class PaymentmethodsApiService implements IPaymentmethodsService {
  private companyId: number;

  constructor(companyId: number) {
    this.companyId = companyId;
  }

  /**
   * Obtener todos los métodos de pago disponibles
   */
  async getPaymentMethods(setLoading?: SetStateFn): Promise<ApiResponse<PaymentMethodModel[]>> {
    const res = await httpRequestWithAuth.get<BackendResponse<PayMethodApiResponse[]>>(
      `/api/paymethods`,
      setLoading
    );

    return extractBackendData(res, (data) =>
      adaptPayMethodsArrayToPaymentMethodModels(data ?? [])
    );
  }

  /**
   * Obtener las configuraciones de pago (cuentas) de la company
   */
  async getPaymentAccounts(setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel[]>> {
    const res = await httpRequestWithAuth.get<BackendResponse<PayCompanyPaymentConfigApiResponse[]>>(
      `/api/payment-config/company/${this.companyId}`,
      setLoading
    );

    return extractBackendData(res, (data) =>
      adaptPayConfigsToPaymentAccountModels(data ?? [])
    );
  }

  /**
   * Crear una nueva configuración de pago
   */
  async createAccount(
    dto: CreatePaymentAccountDto,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<PaymentAccountModel>> {
    const apiDto: CreatePaymentConfigDto = adaptCreateAccountDtoToApiFormat(dto, this.companyId);

    const res = await httpRequestWithAuth.post<BackendResponse<PayCompanyPaymentConfigApiResponse>>(
      `/api/payment-config`,
      apiDto,
      setLoading
    );

    return extractBackendData(res, (data) =>
      adaptPayConfigToPaymentAccountModel(data)
    );
  }

  /**
   * Actualizar una configuración de pago existente
   */
  async updateAccount(
    dto: UpdatePaymentAccountDto,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<PaymentAccountModel>> {
    const apiDto: UpdatePaymentConfigDto = adaptUpdateAccountDtoToApiFormat(dto);

    const res = await httpRequestWithAuth.put<BackendResponse<PayCompanyPaymentConfigApiResponse>>(
      `/api/payment-config/${dto.uuid}`,
      apiDto,
      setLoading
    );

    return extractBackendData(res, (data) =>
      adaptPayConfigToPaymentAccountModel(data)
    );
  }

  /**
   * Eliminar una configuración de pago
   */
  async deleteAccount(uuid: string, setLoading?: SetStateFn): Promise<ApiResponse<boolean>> {
    const res = await httpRequestWithAuth.delete<BackendResponse<null>>(
      `/api/payment-config/${uuid}`,
      setLoading
    );

    const backendStatus = res.data?.status ?? res.status;
    return {
      status: backendStatus,
      message: res.data?.message ?? res.message,
      data: backendStatus >= 200 && backendStatus < 300,
    };
  }

  /**
   * Activar/Desactivar una configuración de pago
   */
  async toggleAccountActive(
    uuid: string,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<PaymentAccountModel>> {
    const res = await httpRequestWithAuth.put<BackendResponse<PayCompanyPaymentConfigApiResponse>>(
      `/api/payment-config/${uuid}/toggle-active`,
      {},
      setLoading
    );

    return extractBackendData(res, (data) =>
      adaptPayConfigToPaymentAccountModel(data)
    );
  }

  /**
   * Establecer una cuenta como predeterminada
   * Nota: El backend actual no soporta esta funcionalidad,
   * se mantiene para compatibilidad con la interfaz
   */
  async setAccountAsDefault(
    accountUuid: string,
    _methodId: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<PaymentAccountModel>> {
    // El backend no tiene endpoint para default, retornamos la cuenta actual
    const res = await httpRequestWithAuth.get<BackendResponse<PayCompanyPaymentConfigApiResponse>>(
      `/api/payment-config/${accountUuid}`,
      setLoading
    );

    return extractBackendData(res, (data) =>
      adaptPayConfigToPaymentAccountModel(data)
    );
  }

  /**
   * Probar conexión con el proveedor de pago (PayPal)
   */
  async testConnection(
    uuid: string,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<TestConnectionResponse>> {
    const res = await httpRequestWithAuth.post<BackendResponse<TestConnectionResponse>>(
      `/api/payment-config/${uuid}/test`,
      {},
      setLoading
    );

    return extractBackendData(res, (data) => data);
  }

  /**
   * Actualizar el companyId (útil si cambia el contexto)
   */
  setCompanyId(companyId: number): void {
    this.companyId = companyId;
  }
}

/**
 * Factory function para crear instancia del servicio
 */
export const createPaymentmethodsApiService = (companyId: number): PaymentmethodsApiService => {
  return new PaymentmethodsApiService(companyId);
};
