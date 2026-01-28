import { httpRequestWithAuth } from '@/services/httpService';
import { ApiResponse } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';
import {
  OAuthConnectResponse,
  OAuthStatusResponse,
  OAuthConfigListItem,
  PaymentConfigMode,
} from '../models/PaymentmethodsModel';

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

  return {
    status: backendStatus,
    message: backendResponse.message ?? httpResponse.message,
    data: transform(backendResponse.data),
  };
};

/**
 * Servicio para OAuth de PayPal
 */
export class PayPalOAuthService {
  private companyId: number;

  constructor(companyId: number) {
    this.companyId = companyId;
  }

  /**
   * Iniciar conexión OAuth - obtiene URL de autorización
   * El comercio debe proporcionar sus credenciales de PayPal Developer
   */
  async connect(
    clientId: string,
    clientSecret: string,
    mode: PaymentConfigMode = 'sandbox',
    currency: string = 'EUR',
    brandName?: string,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<OAuthConnectResponse>> {
    const res = await httpRequestWithAuth.post<BackendResponse<OAuthConnectResponse>>(
      '/api/paypal/oauth/connect',
      {
        gbl_company_id: this.companyId,
        client_id: clientId,
        client_secret: clientSecret,
        mode,
        default_currency: currency,
        brand_name: brandName,
      },
      setLoading
    );

    return extractBackendData(res, (data) => data);
  }

  /**
   * Desconectar cuenta PayPal
   */
  async disconnect(configUuid: string, setLoading?: SetStateFn): Promise<ApiResponse<{ message: string }>> {
    const res = await httpRequestWithAuth.post<BackendResponse<{ message: string }>>(
      '/api/paypal/oauth/disconnect',
      { config_uuid: configUuid },
      setLoading
    );

    return extractBackendData(res, (data) => data);
  }

  /**
   * Reconectar cuenta (iniciar nuevo flujo OAuth)
   */
  async reconnect(configUuid: string, setLoading?: SetStateFn): Promise<ApiResponse<OAuthConnectResponse>> {
    const res = await httpRequestWithAuth.post<BackendResponse<OAuthConnectResponse>>(
      '/api/paypal/oauth/reconnect',
      { config_uuid: configUuid },
      setLoading
    );

    return extractBackendData(res, (data) => data);
  }

  /**
   * Obtener estado de conexión OAuth
   */
  async getStatus(configUuid: string, setLoading?: SetStateFn): Promise<ApiResponse<OAuthStatusResponse>> {
    const res = await httpRequestWithAuth.get<BackendResponse<OAuthStatusResponse>>(
      `/api/paypal/oauth/status/${configUuid}`,
      setLoading
    );

    return extractBackendData(res, (data) => data);
  }

  /**
   * Activar/Desactivar configuración
   */
  async toggleActive(configUuid: string, setLoading?: SetStateFn): Promise<ApiResponse<{ uuid: string; is_active: boolean; message: string }>> {
    const res = await httpRequestWithAuth.put<BackendResponse<{ uuid: string; is_active: boolean; message: string }>>(
      `/api/paypal/oauth/${configUuid}/toggle-active`,
      {},
      setLoading
    );

    return extractBackendData(res, (data) => data);
  }

  /**
   * Listar configuraciones OAuth de la empresa
   */
  async listConfigs(setLoading?: SetStateFn): Promise<ApiResponse<OAuthConfigListItem[]>> {
    const res = await httpRequestWithAuth.get<BackendResponse<OAuthConfigListItem[]>>(
      `/api/paypal/oauth/company/${this.companyId}`,
      setLoading
    );

    return extractBackendData(res, (data) => data ?? []);
  }

  /**
   * Actualizar companyId
   */
  setCompanyId(companyId: number): void {
    this.companyId = companyId;
  }
}

/**
 * Factory function
 */
export const createPayPalOAuthService = (companyId: number): PayPalOAuthService => {
  return new PayPalOAuthService(companyId);
};
