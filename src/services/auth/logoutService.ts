// ==========================================
// GLOBAL LOGOUT SERVICE
// ==========================================

import { createApiInstance, loadAbort } from '@/services/httpService';
import { AxiosCallModel } from '@/models/axiosCallModel';
import type { Result } from '@/types';

// Create API instance
const api = createApiInstance();

interface ApiResponse {
  success: boolean;
  message: string;
}

// Simple logout HTTP call
const logoutHttpCall = (): AxiosCallModel<ApiResponse> => {
  const controller = loadAbort();

  return {
    call: api.post<ApiResponse>('/auth/logout', {}, {
      signal: controller.signal
    }),
    controller
  };
};

// Simple logout service with automatic cleanup
export const logoutService = async (): Promise<Result<boolean>> => {
  try {
    // Clear local storage first
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('lastLogin');

    // Attempt API logout (non-blocking)
    const axiosCall = logoutHttpCall();
    await axiosCall.call;

    return {
      success: true,
      data: true
    };
  } catch (error: any) {
    // Even if API logout fails, local logout is successful
    return {
      success: true,
      data: true
    };
  }
};