
export interface UserResponseModel {
  id: number;
  name: string;
  lastName: string;
  phone: string | null;
  email: string;
  avatar: string | null;
  workStation: WorkStation;
}


export interface WorkStation {
  id: number;
  name: string | null;
  level: number;
  dependency_id: number;
}