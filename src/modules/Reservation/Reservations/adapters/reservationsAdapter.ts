import { ReservationsModel } from '../models/ReservationsModel';

export const adaptReservationsResponseToReservationsModel = (apiData: any): ReservationsModel => {
  return {
    id: apiData.id,
  } as ReservationsModel;
};

export const adaptReservationsArrayToReservationsModels = (apiDataArray: any[]): ReservationsModel[] => {
  return apiDataArray.map(adaptReservationsResponseToReservationsModel);
};
