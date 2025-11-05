/**
 * IBaseService - Interfaz base para todos los services
 *
 * REGLA IMPORTANTE:
 * - Todos los services deben implementar métodos que retornen ServiceData<T>
 * - El ServiceWrapper manejará loading y errores automáticamente
 * - NO incluir loading/error en la respuesta del service
 *
 * @example
 * export class UserService implements IBaseService {
 *   async getUsersByCompany(companyId: number): Promise<ServiceData<UserModel[]>> {
 *     const response = await api.get(`/users?companyId=${companyId}`);
 *     return { data: response.data };
 *   }
 * }
 */
export interface IBaseService {
  // Interfaz base vacía - cada service define sus propios métodos
  // pero todos deben retornar ServiceData<T>
}

/**
 * ServiceData - Respuesta estándar de todos los services
 *
 * SIMPLE: Solo contiene los datos
 * Loading y errores son manejados por el ServiceWrapper
 *
 * @template T - Tipo de dato que devuelve el service
 */
export interface ServiceData<T> {
  data: T;
}

/**
 * Helper para crear respuestas de service
 *
 * @example
 * return createServiceData([user1, user2, user3]);
 */
export const createServiceData = <T>(data: T): ServiceData<T> => {
  return { data };
};
