import { httpRequestWithAuth } from '@/services/httpService';
import { IPaymentGatewayService } from './IPaymentGatewayService';
import { PaymentGatewayModel } from '../models/PaymentGatewayModel';
import { adaptPaymentGatewayArrayToPaymentGatewayModels } from '../adapters/paymentgatewayAdapter';
import { ApiResponse, transformApiData } from '@/shared/types';

type SetStateFn = (loading: boolean) => void;

export class PaymentGatewayApiService implements IPaymentGatewayService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<PaymentGatewayModel[]>> {
    const res = await httpRequestWithAuth.get<ApiResponse<any>>(
      `/paymentgateway`,
      setLoading
    );

    return transformApiData(res, (data) =>
      adaptPaymentGatewayArrayToPaymentGatewayModels(data.data ?? [])
    );
  }
}
