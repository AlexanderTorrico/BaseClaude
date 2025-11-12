import { PaymentGatewayModel } from '../../models/PaymentGatewayModel';

export const MOCK_PAYMENTGATEWAYS: PaymentGatewayModel[] = [
  { id: 1 },
  { id: 2 },
];

export const mockPaymentGateway = MOCK_PAYMENTGATEWAYS[0]!;
export const mockPaymentGateways = MOCK_PAYMENTGATEWAYS;
