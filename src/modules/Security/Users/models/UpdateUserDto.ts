export interface UpdateUserDto {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  repeatPassword?: string;
  gbl_company_id: string;
  workStationId: number;
  avatar?: File | null;
}
