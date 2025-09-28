// ==========================================
// LOGOUT USE CASE - FUNCTIONAL APPROACH
// ==========================================

import type { Result } from '../models';
import { logoutFromApi } from '../adapters/loginApiAdapter';

export const logoutUseCase = () => {
  return async (): Promise<Result<boolean>> => {
    try {
      // Call logout adapter
      const result = await logoutFromApi();

      if (result.success) {
        return {
          success: true,
          data: true
        };
      }

      return {
        success: false,
        error: result.error || 'Error al cerrar sesión'
      };
    } catch (error: any) {
      // Even if logout fails, we return success for local cleanup
      return {
        success: true,
        data: true
      };
    }
  };
};