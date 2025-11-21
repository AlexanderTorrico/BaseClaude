import { CreatePageModel } from '../models/CreatePageModel';

export const adaptCreatePageResponseToCreatePageModel = (apiData: any): CreatePageModel => {
  return {
    id: apiData.id,
  } as CreatePageModel;
};

export const adaptCreatePageArrayToCreatePageModels = (apiDataArray: any[]): CreatePageModel[] => {
  return apiDataArray.map(adaptCreatePageResponseToCreatePageModel);
};
