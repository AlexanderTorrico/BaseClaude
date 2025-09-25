// ==========================================
// LOGIN API ADAPTER - FUNCTIONAL APPROACH
// ==========================================

import type { LoginCredentials, AuthUser, Result } from '../models';
import { loginService, socialLoginService, logoutService } from '../services/loginHttpService';
import { extractErrorMessage } from '../utils/loginHelpers';

// Adapt API user response to domain AuthUser
export const adaptApiUserToAuthUser = (apiResponse: any): AuthUser => ({
  id: apiResponse.data.data.id?.toString() || '',
  name: apiResponse.data.data.name || '',
  lastName: apiResponse.data.data.last_name || '',
  email: apiResponse.data.data.email || '',
  token: apiResponse.data.access_token || '',
  privilege: apiResponse.data.data.privilege || 'user',
  phone: apiResponse.data.data.phone || '',
  logo: apiResponse.data.data.logo || '',
  language: apiResponse.data.data.language || 'es',
  status: apiResponse.data.data.status === 1 ? 'active' : 'inactive',
  modules: apiResponse.data.modules || [],
  roles: apiResponse.data.roles || [],
  permissions: apiResponse.data.direct_permissions || []
});

// Login adapter function
export const loginFromApi = async (
  credentials: LoginCredentials
): Promise<Result<AuthUser>> => {
  try {
    const axiosCall = loginService(credentials);
    const response = await axiosCall.call;

    // Log para debug - puedes quitar esto después
    console.log('🔍 Login Response Debug:', {
      status: response.status,
      data: response.data
    });

    // Tu backend responde con status: 200 y message: "success"
    if (response.data.status === 200 && response.data.message === "success" && response.data.data) {
      const authUser = adaptApiUserToAuthUser(response);

      console.log('✅ Login Success - AuthUser created:', authUser);

      return {
        success: true,
        data: authUser
      };
    }

    console.log('❌ Login Failed - Response:', response.data);
    return {
      success: false,
      error: response.data.message || 'Login failed'
    };
  } catch (error: any) {
    console.log('🚨 Login Error:', error);
    console.log('🚨 Error Response:', error.response?.data);

    return {
      success: false,
      error: extractErrorMessage(error)
    };
  }
};

// Social login adapter function
export const socialLoginFromApi = async (
  provider: string,
  token: string
): Promise<Result<AuthUser>> => {
  try {
    const axiosCall = socialLoginService(provider, token);
    const response = await axiosCall.call;

    if (response.data.success && response.data.data) {
      const { data } = response.data;
      const authUser = adaptApiUserToAuthUser(data.user, data.access_token);

      return {
        success: true,
        data: authUser
      };
    }

    return {
      success: false,
      error: response.data.message || 'Social login failed'
    };
  } catch (error: any) {
    return {
      success: false,
      error: extractErrorMessage(error)
    };
  }
};

// Logout adapter function
export const logoutFromApi = async (): Promise<Result<boolean>> => {
  try {
    const axiosCall = logoutService();
    const response = await axiosCall.call;

    if (response.data.success) {
      return {
        success: true,
        data: true
      };
    }

    return {
      success: false,
      error: response.data.message || 'Logout failed'
    };
  } catch (error: any) {
    // Even if API logout fails, we consider it successful locally
    return {
      success: true,
      data: true
    };
  }
};

// Session storage adapter functions
export const saveUserToStorage = (user: AuthUser): void => {
  try {
    localStorage.setItem('authUser', JSON.stringify({
      id: user.id,
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
    console.warn('Failed to save user to storage:', error);
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
      token,
      modules: [],
      roles: [],
      permissions: []
    };
  } catch (error) {
    console.warn('Failed to get user from storage:', error);
    return null;
  }
};

export const clearUserFromStorage = (): void => {
  try {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('lastLogin');
  } catch (error) {
    console.warn('Failed to clear user from storage:', error);
  }
};