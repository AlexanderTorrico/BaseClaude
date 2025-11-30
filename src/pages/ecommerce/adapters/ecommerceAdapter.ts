import { ecommerceModel } from '../models/ecommerceModel';

export const adaptecommerceResponseToecommerceModel = (apiData: any): ecommerceModel => {
  return {
    id: apiData.id,
  } as ecommerceModel;
};

export const adaptecommerceArrayToecommerceModels = (apiDataArray: any[]): ecommerceModel[] => {
  return apiDataArray.map(adaptecommerceResponseToecommerceModel);
};
