import {
  PaymentMethodModel,
  PaymentAccountModel,
  CreatePaymentAccountDto,
  UpdatePaymentAccountDto,
  TestConnectionResponse,
} from '../models/PaymentmethodsModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

export interface IPaymentmethodsService {
  /** Obtener métodos de pago disponibles en la plataforma */
  getPaymentMethods(setLoading?: SetStateFn): Promise<ApiResponse<PaymentMethodModel[]>>;

  /** Obtener configuraciones de pago de la company */
  getPaymentAccounts(setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel[]>>;

  /** Crear nueva configuración de pago */
  createAccount(dto: CreatePaymentAccountDto, setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel>>;

  /** Actualizar configuración de pago existente */
  updateAccount(dto: UpdatePaymentAccountDto, setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel>>;

  /** Eliminar configuración de pago */
  deleteAccount(uuid: string, setLoading?: SetStateFn): Promise<ApiResponse<boolean>>;

  /** Activar/Desactivar configuración de pago */
  toggleAccountActive(uuid: string, setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel>>;

  /** Establecer cuenta como predeterminada */
  setAccountAsDefault(accountUuid: string, methodId: number, setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel>>;

  /** Probar conexión con el proveedor de pago */
  testConnection?(uuid: string, setLoading?: SetStateFn): Promise<ApiResponse<TestConnectionResponse>>;
}
