import { UserModel } from '../models/UserModel';
import { WorkStationModel } from '../models/WorkStationModel';
import { RoleModel } from '../../Roles/models/RoleModel';
import { PermissionModel } from '../../Roles/models/PermissionModel';

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
