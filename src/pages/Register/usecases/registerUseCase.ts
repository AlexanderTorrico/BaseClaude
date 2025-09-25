import { RegisterCredentials, Result } from '../types/registerTypes';
import { registerApiService } from '../services/registerApiService';
import { registerApiAdapter } from '../services/registerApiAdapter';
import { validateRegisterForm, sanitizeRegisterInput } from '../utils/registerValidators';

export const registerUseCase = async (credentials: RegisterCredentials): Promise<Result<any>> => {
  try {
    console.log('🏗️ Register UseCase - Starting registration process');

    const validation = validateRegisterForm(credentials);
    if (!validation.isValid) {
      return {
        success: false,
        error: Object.values(validation.errors)[0] || 'Validation failed'
      };
    }

    const sanitizedCredentials = sanitizeRegisterInput(credentials);
    console.log('✅ Register UseCase - Credentials validated and sanitized');

    const apiResult = await registerApiService.register(sanitizedCredentials);

    if (!apiResult.success) {
      console.error('❌ Register UseCase - API call failed:', apiResult.error);
      return apiResult;
    }

    if (!apiResult.data) {
      return {
        success: false,
        error: 'No data received from registration API'
      };
    }

    const adaptedResult = registerApiAdapter.adapt(apiResult.data);

    if (!adaptedResult.success) {
      console.error('❌ Register UseCase - Adapter failed:', adaptedResult.error);
      return adaptedResult;
    }

    console.log('✅ Register UseCase - Registration completed successfully');
    return adaptedResult;

  } catch (error: any) {
    console.error('❌ Register UseCase - Unexpected error:', error);
    return {
      success: false,
      error: 'Registration process failed'
    };
  }
};