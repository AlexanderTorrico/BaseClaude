import { PaymentGatewayModel } from '../models/PaymentGatewayModel';

export const adaptPaymentGatewayResponseToPaymentGatewayModel = (apiData: any): PaymentGatewayModel => {
  return {
    id: apiData.id,
  } as PaymentGatewayModel;
};

export const adaptPaymentGatewayArrayToPaymentGatewayModels = (apiDataArray: any[]): PaymentGatewayModel[] => {
  return apiDataArray.map(adaptPaymentGatewayResponseToPaymentGatewayModel);
};
