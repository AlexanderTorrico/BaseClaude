import { post } from '../../../helpers/api_helper';
import { RegisterCredentials, RegisterResponse, Result } from '../types/registerTypes';

export const registerApiService = {
  register: async (credentials: RegisterCredentials): Promise<Result<RegisterResponse>> => {
    try {
      console.log('🚀 Register API - Sending request:', credentials);

      const response = await post('/api/register', credentials) as RegisterResponse;

      console.log('✅ Register API - Response received:', response);

      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          data: response
        };
      } else {
        return {
          success: false,
          error: response.message || 'Registration failed'
        };
      }
    } catch (error: any) {
      console.error('❌ Register API Error:', error);

      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          'Network error during registration';

      return {
        success: false,
        error: errorMessage
      };
    }
  }
};