import { UserResponseModel } from '../models/UserResponseModel';
import { UserModel } from '../models/UserModel';

/**
 * Adapta la respuesta de la API al modelo de la UI
 */
export const adaptUserResponseToUserModel = (apiUser: any): UserModel => {
  return {
    id: apiUser.id,
    fullName: `${apiUser.name} ${apiUser.last_name}`.trim(),
    firstName: apiUser.name,
    lastName: apiUser.last_name,
    lastNameMother: apiUser.last_name_mother || '',
    email: apiUser.email,
    privilege: apiUser.privilege,
    phone: apiUser.phone,
    logo: apiUser.logo,
    language: apiUser.language,
    isActive: apiUser.status === 1
  };
};

/**
 * Adapta un array de usuarios de la API
 */
export const adaptUsersArrayToUserModels = (apiUsers: UserResponseModel[]): UserModel[] => {
  return apiUsers.map(adaptUserResponseToUserModel);
};

/**
 * Helper para convertir string ISO a Date cuando lo necesites en la UI
 */
export const parseUserDate = (isoString: string): Date => {
  return new Date(isoString);
};

/**
 * Helper para formatear fecha de usuario
 */
export const formatUserDate = (isoString: string, locale: string = 'es-ES'): string => {
  return new Date(isoString).toLocaleDateString(locale);
};
