/**
 * DTO para la actualización de usuarios existentes
 * La contraseña es opcional - solo se envía si el usuario desea cambiarla
 */
export interface UpdateUserDto {
  id: number;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  gbl_company_id: string;
  workStationId: number;
  avatar?: File | null;
  password?: string;
  repeatPassword?: string;
}
