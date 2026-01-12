/**
 * DTO para la actualización de usuarios existentes
 *
 * NOTAS:
 * - password es opcional: solo se envía si el usuario desea cambiarla
 * - gbl_company_id se convierte a number internamente en useUsersFetch
 * - workStation es un JSON string que se envía como FormData
 */
export interface UpdateUserDto {
  uuid: string;  // UUID del usuario a actualizar (identificador único)
  name: string;
  lastName: string;
  phone: string;
  email: string;
  gbl_company_id: number | string;  // Se normaliza a number en el hook
  workStation: string;  // JSON string: '{"name":"Puesto","dependency_id":1}'
  avatar?: File | null;
  password?: string;  // Solo si se quiere cambiar la contraseña
}

