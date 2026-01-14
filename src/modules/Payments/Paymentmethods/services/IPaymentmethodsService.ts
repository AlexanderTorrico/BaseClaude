import {
  PaymentMethodModel,
  PaymentAccountModel,
  CreatePaymentAccountDto,
  UpdatePaymentAccountDto
} from '../models/PaymentmethodsModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

export interface IPaymentmethodsService {
  getPaymentMethods(setLoading?: SetStateFn): Promise<ApiResponse<PaymentMethodModel[]>>;

  getPaymentAccounts(setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel[]>>;

  createAccount(dto: CreatePaymentAccountDto, setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel>>;

  updateAccount(dto: UpdatePaymentAccountDto, setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel>>;

  deleteAccount(id: number, setLoading?: SetStateFn): Promise<ApiResponse<boolean>>;

  toggleAccountActive(id: number, setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel>>;

  setAccountAsDefault(accountId: number, methodId: number, setLoading?: SetStateFn): Promise<ApiResponse<PaymentAccountModel>>;
}
