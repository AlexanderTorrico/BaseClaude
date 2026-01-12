/**
 * DTO para la creación de nuevos usuarios
 *
 * NOTAS:
 * - repeatPassword es solo para validación frontend, no se envía al backend
 * - gbl_company_id se convierte a number internamente en useUsersFetch
 * - workStation es un JSON string que se envía como FormData
 */
export interface CreateUserDto {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  repeatPassword: string;  // Solo validación frontend
  gbl_company_id: number | string;  // Se normaliza a number en el hook
  workStation: string;  // JSON string: '{"name":"Puesto","dependency_id":1}'
  avatar?: File | null;
}
