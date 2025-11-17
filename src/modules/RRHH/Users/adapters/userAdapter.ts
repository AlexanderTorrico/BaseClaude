import { UserModel } from '../models/UserModel';
import { WorkStationModel } from '../models/WorkStationModel';

/**
 * Adapta WorkStation de la API al modelo de la UI
 */
const adaptWorkStation = (workStation: any): WorkStationModel => {
  return {
    id: workStation.id,
    name: workStation.name,
    level: workStation.level,
    dependencyId: workStation.dependency_id
  };
};

/**
 * Adapta la respuesta de la API al modelo de la UI
 */
export const adaptUserResponseToUserModel = (apiUser: any): UserModel => {
  return {
    id: apiUser.id,
    fullName: `${apiUser.name} ${apiUser.lastName}`.trim(),
    name: apiUser.name,
    lastName: apiUser.lastName,
    email: apiUser.email,
    phone: apiUser.phone,
    avatar: apiUser.avatar,
    workStation: adaptWorkStation(apiUser.workStation),
    // Roles y permisos (opcionales)
    roleIds: apiUser.roleIds || apiUser.role_ids || [],
    roles: apiUser.roles || [],
    permissionIds: apiUser.permissionIds || apiUser.permission_ids || [],
    permissions: apiUser.permissions || []
  };
};

/**
 * Adapta un array de usuarios de la API
 */
export const adaptUsersArrayToUserModels = (apiUsers: any): UserModel[] => {
  return apiUsers.map(adaptUserResponseToUserModel);
};

/**
 * Adapta los datos del formulario de registro al modelo UserModel
 * Combina datos del FormData y respuesta de la API
 */
export const adaptRegisterResponseToUserModel = (
  formData: FormData,
  apiData: any
): UserModel => {
  return {
    id: apiData?.id || Date.now(),
    fullName: `${formData.get('name')} ${formData.get('lastName')}`.trim(),
    name: formData.get('name') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    avatar: apiData?.avatar || null,
    workStation: apiData?.workStation
      ? adaptWorkStation(apiData.workStation)
      : apiData?.work_station
        ? adaptWorkStation(apiData.work_station)
        : {
            id: 0,
            name: 'Sin asignar',
            level: 0,
            dependencyId: 0
          },
    roleIds: apiData?.roleIds || apiData?.role_ids || [],
    roles: apiData?.roles || [],
    permissionIds: apiData?.permissionIds || apiData?.permission_ids || [],
    permissions: apiData?.permissions || [],
  };
};
