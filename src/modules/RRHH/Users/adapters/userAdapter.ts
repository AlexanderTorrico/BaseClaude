import { UserModel } from '../models/UserModel';
import { WorkStationModel } from '@/modules/RRHH/WorkStations/models/WorkStationModel';

/**
 * Crea un WorkStation por defecto
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
 */
const adaptWorkStation = (workStation: any): WorkStationModel => {
  return {
    id: workStation.id,
    name: workStation.name || '',
    description: workStation.description || '',
    active: workStation.active ?? 1,
    gblCompanyId: workStation.gbl_company_id || workStation.gblCompanyId || 0,
    requirements: workStation.requirements || [],
    responsabilities: workStation.responsabilities || [],
    level: workStation.level,
    dependencyId: workStation.dependency_id || workStation.dependencyId
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
  // El apiData puede venir directo o envuelto en .data
  const userData = apiData?.data || apiData;

  // Obtener workStation de la respuesta API o del FormData
  let workStation: WorkStationModel;

  if (userData?.workStation) {
    workStation = adaptWorkStation(userData.workStation);
  } else if (userData?.work_station) {
    workStation = adaptWorkStation(userData.work_station);
  } else {
    // Fallback: intentar parsear desde el FormData
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
