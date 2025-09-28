// ==========================================
// LOGIN HTTP SERVICE - WITH AUTOMATIC ADAPTER
// ==========================================

import { createApiInstance, loadAbort } from '@/services/httpService';
import { AxiosCallModel } from '@/models/axiosCallModel';
import type { LoginCredentials, AuthUser, Result } from '../models';
import {
  adaptApiUserToAuthUser,
  adaptSocialApiUserToAuthUser,
  isValidLoginResponse,
  isValidSocialLoginResponse
} from '../adapters/loginApiAdapter';
import { extractErrorMessage } from '../utils/loginHelpers';

// Create API instance
const api = createApiInstance();

// API Response interfaces - Estructura de tu backend
interface ApiResponse {
  status: number;
  message: string;
  data: {
    access_token: string;
    modules: Array<{
      id: number;
      name: string;
      description: string;
      icon: string;
      path: string;
      color: string;
      img: string;
      weight_for_edit: number;
      type: string | null;
      module_company_id: number;
      with_web_editor: number;
      steps: any[];
    }>;
    roles: any[];
    direct_permissions: any[];
    data: {
      id: number;
      name: string;
      last_name: string;
      last_name_mother: string;
      email: string;
      email_verified_at: string | null;
      token: string | null;
      privilege: string;
      phone: string | null;
      logo: string | null;
      language: string;
      status: number;
      user_id: number | null;
      created_at: string;
      updated_at: string;
    };
  };
}

// Raw login HTTP service (returns AxiosCallModel)
export const loginHttpCall = (
  credentials: LoginCredentials
): AxiosCallModel<ApiResponse> => {
  const controller = loadAbort();

  return {
    call: api.post<ApiResponse>('/login', {
      email: credentials.email,
      password: credentials.password,
      remember_me: credentials.rememberMe
    }, {
      signal: controller.signal
    }),
    controller
  };
};

// Login service with automatic adapter (returns Promise<Result<AuthUser>>)
export const loginService = async (
  credentials: LoginCredentials
): Promise<Result<AuthUser>> => {
  try {
    const axiosCall = loginHttpCall(credentials);
    const response = await axiosCall.call;

    // Debug temporal - revisar la respuesta completa
    console.log('🔍 Login Response Debug:', {
      status: response.status,
      data: response.data,
      dataStatus: response.data?.status,
      dataMessage: response.data?.message,
      hasData: !!response.data?.data
    });

    if (isValidLoginResponse(response)) {
      const authUser = adaptApiUserToAuthUser(response);
      return {
        success: true,
        data: authUser
      };
    }

    return {
      success: false,
      error: response.data.message || 'Login failed'
    };
  } catch (error: any) {
    return {
      success: false,
      error: extractErrorMessage(error)
    };
  }
};

// Raw social login HTTP service
export const socialLoginHttpCall = (
  provider: string,
  token: string
): AxiosCallModel<ApiResponse> => {
  const controller = loadAbort();

  return {
    call: api.post<ApiResponse>(`/auth/social/${provider}`, {
      access_token: token
    }, {
      signal: controller.signal
    }),
    controller
  };
};

// Social login service with automatic adapter
export const socialLoginService = async (
  provider: string,
  token: string
): Promise<Result<AuthUser>> => {
  try {
    const axiosCall = socialLoginHttpCall(provider, token);
    const response = await axiosCall.call;

    if (isValidSocialLoginResponse(response)) {
      const authUser = adaptSocialApiUserToAuthUser(response.data.data);
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


// Raw refresh token HTTP service
export const refreshTokenHttpCall = (
  refreshToken: string
): AxiosCallModel<ApiResponse> => {
  const controller = loadAbort();

  return {
    call: api.post<ApiResponse>('/auth/refresh', {
      refresh_token: refreshToken
    }, {
      signal: controller.signal
    }),
    controller
  };
};

// Raw validate session HTTP service
export const validateSessionHttpCall = (): AxiosCallModel<ApiResponse> => {
  const controller = loadAbort();

  return {
    call: api.get<ApiResponse>('/auth/validate', {
      signal: controller.signal
    }),
    controller
  };
};