import { IPaymentGatewayService } from './IPaymentGatewayService';
import { PaymentGatewayModel } from '../models/PaymentGatewayModel';
import { ApiResponse } from '@/shared/types';

const MOCK_PAYMENTGATEWAYS: PaymentGatewayModel[] = [
  { id: 1 },
  { id: 2 },
];

type SetStateFn = (loading: boolean) => void;

export class PaymentGatewayMockService implements IPaymentGatewayService {
  async getAll(setLoading?: SetStateFn): Promise<ApiResponse<PaymentGatewayModel[]>> {
    setLoading?.(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading?.(false);

    return {
      status: 200,
      message: 'Success (mock)',
      data: MOCK_PAYMENTGATEWAYS,
    };
  }
}
