import { ReservationModel } from '../models/ReservationModel';

export const adaptReservationResponseToReservationModel = (apiData: any): ReservationModel => {
  return {
    id: apiData.id,
  } as ReservationModel;
};

export const adaptReservationArrayToReservationModels = (apiDataArray: any[]): ReservationModel[] => {
  return apiDataArray.map(adaptReservationResponseToReservationModel);
};
