import { UserModel } from '../models/UserModel';
import { WorkStationModel } from '@/modules/RRHH/WorkStations/models/WorkStationModel';

/**
 * Adaptadores para transformar datos entre la API y los modelos de la UI.
 *
 * NOTAS SOBRE FALLBACKS:
 * El backend tiene inconsistencias en los nombres de campos:
 * - camelCase vs snake_case (lastName vs last_name)
 * - idWorkStation vs id
 * - work_station vs workStation
 *
 * Los fallbacks aseguran compatibilidad mientras se normaliza el backend.
 * TODO: Remover fallbacks cuando el backend use naming consistente.
 */

/**
 * Crea un WorkStation por defecto cuando no hay datos disponibles
 */
const createDefaultWorkStation = (): WorkStationModel => ({
  id: 0,
  name: 'Sin asignar',
  description: '',
  active: 1,
  gblCompanyId: 0,
  requirements: [],
  responsabilities: [],
  level: 0
});

/**
 * Adapta WorkStation de la API al modelo de la UI
 *
 * @param workStation - Datos crudos del workStation desde la API
 * @returns WorkStationModel normalizado
 */
const adaptWorkStation = (workStation: any): WorkStationModel => {
  return {
    // Backend envía 'idWorkStation' en algunos endpoints, 'id' en otros
    id: workStation.idWorkStation || workStation.id,
    name: workStation.name || '',
    description: workStation.description || '',
    active: workStation.active ?? 1,
    // Variación snake_case vs camelCase
    gblCompanyId: workStation.gbl_company_id || workStation.gblCompanyId || 0,
    requirements: workStation.requirements || [],
    responsabilities: workStation.responsabilities || [],
    level: workStation.level,
    // Variación snake_case vs camelCase
    dependencyId: workStation.dependency_id || workStation.dependencyId
  };
};

/**
 * Adapta la respuesta de un usuario individual de la API al modelo de la UI
 *
 * UUID es el identificador principal. El id numérico se mantiene por
 * compatibilidad con código legacy.
 *
 * @param apiUser - Datos crudos del usuario desde la API
 * @returns UserModel normalizado
 */
export const adaptUserResponseToUserModel = (apiUser: any): UserModel => {
  return {
    // UUID es el identificador principal
    uuid: apiUser.uuid || apiUser.id?.toString() || '',
    // ID numérico para compatibilidad legacy
    id: apiUser.id,
    fullName: `${apiUser.name} ${apiUser.lastName || apiUser.last_name || ''}`.trim(),
    name: apiUser.name,
    // Backend puede enviar lastName o last_name
    lastName: apiUser.lastName || apiUser.last_name || '',
    email: apiUser.email,
    phone: apiUser.phone,
    avatar: apiUser.avatar,
    // Backend puede enviar workStation o work_station
    workStation: apiUser.workStation ? adaptWorkStation(apiUser.workStation)
      : apiUser.work_station ? adaptWorkStation(apiUser.work_station)
        : createDefaultWorkStation(),
    // Arrays opcionales con fallback snake_case
    roleIds: apiUser.roleIds || apiUser.role_ids || [],
    roles: apiUser.roles || [],
    permissionIds: apiUser.permissionIds || apiUser.permission_ids || [],
    permissions: apiUser.permissions || []
  };
};

/**
 * Adapta un array de usuarios de la API
 *
 * @param apiUsers - Array de datos crudos desde la API
 * @returns Array de UserModel normalizados
 */
export const adaptUsersArrayToUserModels = (apiUsers: any[]): UserModel[] => {
  return apiUsers.map(adaptUserResponseToUserModel);
};

/**
 * Adapta la respuesta de creación/actualización de usuario.
 * Combina datos del FormData original con la respuesta de la API.
 *
 * Se usa cuando la API no devuelve todos los campos en la respuesta
 * y necesitamos reconstruir el modelo completo.
 *
 * @param formData - FormData original enviado al backend
 * @param apiData - Respuesta de la API (puede venir envuelta en .data)
 * @returns UserModel completo
 */
export const adaptRegisterResponseToUserModel = (
  formData: FormData,
  apiData: any
): UserModel => {
  // La API puede devolver datos directos o envueltos en .data
  const userData = apiData?.data || apiData;

  // Obtener workStation: priorizar respuesta API, fallback a FormData
  let workStation: WorkStationModel;

  if (userData?.workStation) {
    workStation = adaptWorkStation(userData.workStation);
  } else if (userData?.work_station) {
    workStation = adaptWorkStation(userData.work_station);
  } else {
    // Fallback: reconstruir desde FormData cuando API no devuelve workStation
    const wsJson = formData.get('workStation') as string;
    if (wsJson) {
      try {
        const parsed = JSON.parse(wsJson);
        workStation = {
          id: userData?.id || 0,
          name: parsed.name || 'Sin asignar',
          description: '',
          active: 1,
          gblCompanyId: 0,
          requirements: [],
          responsabilities: [],
          level: 0,
          ...(parsed.dependency_id && { dependencyId: parsed.dependency_id })
        };
      } catch {
        workStation = createDefaultWorkStation();
      }
    } else {
      workStation = createDefaultWorkStation();
    }
  }

  return {
    // UUID generado por backend o temporal para UI
    uuid: userData?.uuid || userData?.id?.toString() || `temp-${Date.now()}`,
    id: userData?.id || Date.now(),
    fullName: `${formData.get('name')} ${formData.get('lastName')}`.trim(),
    name: formData.get('name') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    avatar: userData?.avatar || null,
    workStation,
    roleIds: userData?.roleIds || userData?.role_ids || [],
    roles: userData?.roles || [],
    permissionIds: userData?.permissionIds || userData?.permission_ids || [],
    permissions: userData?.permissions || [],
  };
};
