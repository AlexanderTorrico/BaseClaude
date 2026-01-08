// ==========================================
// LOGIN API ADAPTER - PURE TRANSFORMATION FUNCTIONS
// ==========================================

import type { AuthUser } from '../models';

// Adapt API user response to domain AuthUser
// El backend ahora devuelve 'uuid' en lugar de 'id'
export const adaptApiUserToAuthUser = (apiResponse: any): AuthUser => {
  console.log('API Response:', apiResponse);
  const userData = apiResponse.data.data;
  return {
    id: userData.uuid || userData.id?.toString() || '',  // Usar uuid como id
    uuid: userData.uuid || '',  // Guardar uuid explícitamente
    name: userData.name || '',
    lastName: userData.last_name || '',
    email: userData.email || '',
    token: apiResponse.data.access_token || '',
    privilege: userData.privilege || 'user',
    phone: userData.phone || '',
    logo: userData.logo || '',
    language: userData.language || 'es',
    status: userData.status === 1 ? 'active' : 'inactive',
    modules: apiResponse.data.modules || [],
    roles: apiResponse.data.roles || [],
    permissions: apiResponse.data.direct_permissions || []
  };
};

// Adapt social login API response to domain AuthUser
export const adaptSocialApiUserToAuthUser = (apiResponse: any): AuthUser => ({
  id: apiResponse.user.uuid || apiResponse.user.id?.toString() || '',
  uuid: apiResponse.user.uuid || '',
  name: apiResponse.user.name || '',
  lastName: apiResponse.user.last_name || '',
  email: apiResponse.user.email || '',
  token: apiResponse.access_token || '',
  privilege: apiResponse.user.privilege || 'user',
  phone: apiResponse.user.phone || '',
  logo: apiResponse.user.logo || '',
  language: apiResponse.user.language || 'es',
  status: apiResponse.user.status === 1 ? 'active' : 'inactive',
  modules: apiResponse.modules || [],
  roles: apiResponse.roles || [],
  permissions: apiResponse.permissions || []
});

// Validate login response structure
export const isValidLoginResponse = (response: any): boolean => {
  return response?.data?.status === 200 &&
    response?.data?.message === "success" &&
    response?.data?.data;
};

// Validate social login response structure
export const isValidSocialLoginResponse = (response: any): boolean => {
  return response?.data?.success && response?.data?.data;
};


// Session storage adapter functions
export const saveUserToStorage = (user: AuthUser): void => {
  try {
    localStorage.setItem('authUser', JSON.stringify({
      id: user.id,  // Este ahora es el uuid
      uuid: user.uuid || user.id,  // Guardar uuid explícitamente
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      privilege: user.privilege,
      phone: user.phone,
      logo: user.logo,
      language: user.language,
      status: user.status
    }));
    localStorage.setItem('authToken', user.token);
    localStorage.setItem('lastLogin', new Date().toISOString());
  } catch (error) {
  }
};

export const getUserFromStorage = (): AuthUser | null => {
  try {
    const userData = localStorage.getItem('authUser');
    const token = localStorage.getItem('authToken');

    if (!userData || !token) return null;

    const user = JSON.parse(userData);
    return {
      ...user,
      uuid: user.uuid || user.id,  // Asegurar que uuid esté presente
      token,
      modules: [],
      roles: [],
      permissions: []
    };
  } catch (error) {
    return null;
  }
};

export const clearUserFromStorage = (): void => {
  try {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('lastLogin');
  } catch (error) {
  }
};