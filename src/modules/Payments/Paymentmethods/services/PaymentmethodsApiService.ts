import { httpRequestWithAuth } from '@/services/httpService';
import { IPaymentmethodsService } from './IPaymentmethodsService';
import { PaymentmethodsModel } from '../models/PaymentmethodsModel';
import { adaptPaymentmethodsArrayToPaymentmethodsModels } from '../adapters/paymentmethodsAdapter';
import { ApiResponse, transformApiData } from '@/shared/types';

type SetStateFn = (loading: boolean) => void;

export class PaymentmethodsApiService implements IPaymentmethodsService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<PaymentmethodsModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/paymentmethods`,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptPaymentmethodsArrayToPaymentmethodsModels(data.data ?? [])
    );
  }
}
