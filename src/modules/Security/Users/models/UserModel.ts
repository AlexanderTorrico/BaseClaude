import { WorkStationModel } from './WorkStationModel';

/**
 * Modelo de Usuario para la UI (mapeado desde la API)
 */
export interface UserModel {
  id: number;
  fullName: string;
  name: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  workStation: WorkStationModel;
}
