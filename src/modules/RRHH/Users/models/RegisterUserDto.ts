/**
 * DTO para el registro de nuevos usuarios
 */
export interface RegisterUserDto {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  repeatPassword: string;
  gbl_company_id: string;
  avatar?: File | null;
}
