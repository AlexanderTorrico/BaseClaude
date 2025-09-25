import { RegisterResponse, Result } from '../types/registerTypes';

export const registerApiAdapter = {
  adapt: (apiResponse: RegisterResponse): Result<any> => {
    try {
      console.log('🔄 Register Adapter - Processing response:', apiResponse);

      if (!apiResponse || typeof apiResponse !== 'object') {
        return {
          success: false,
          error: 'Invalid response format'
        };
      }

      if (apiResponse.status === 200 || apiResponse.status === 201) {
        const adaptedUser = {
          id: apiResponse.data.id,
          email: apiResponse.data.email,
          username: apiResponse.data.username,
          token: apiResponse.data.token,
          registrationDate: new Date().toISOString(),
          ...apiResponse.data
        };

        console.log('✅ Register Adapter - User adapted:', adaptedUser);

        return {
          success: true,
          data: adaptedUser
        };
      } else {
        return {
          success: false,
          error: apiResponse.message || 'Registration failed'
        };
      }
    } catch (error: any) {
      console.error('❌ Register Adapter Error:', error);
      return {
        success: false,
        error: 'Failed to process registration response'
      };
    }
  }
};