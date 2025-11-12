import { InformationModel } from '../models/InformationModel';

export const adaptInformationResponseToInformationModel = (apiData: any): InformationModel => {
  return {
    id: apiData.id,
  } as InformationModel;
};

export const adaptInformationArrayToInformationModels = (apiDataArray: any[]): InformationModel[] => {
  return apiDataArray.map(adaptInformationResponseToInformationModel);
};
