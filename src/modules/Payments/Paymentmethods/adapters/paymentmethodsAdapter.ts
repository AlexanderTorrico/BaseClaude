import { PaymentmethodsModel } from '../models/PaymentmethodsModel';

export const adaptPaymentmethodsResponseToPaymentmethodsModel = (apiData: any): PaymentmethodsModel => {
  return {
    id: apiData.id,
  } as PaymentmethodsModel;
};

export const adaptPaymentmethodsArrayToPaymentmethodsModels = (apiDataArray: any[]): PaymentmethodsModel[] => {
  return apiDataArray.map(adaptPaymentmethodsResponseToPaymentmethodsModel);
};
