import { AppDispatch } from '@/store';
import { RegisterCredentials, Result } from '../types/registerTypes';
import { registerUseCase } from './registerUseCase';
import { saveRegisteredUserToStorage } from '../services/storageService';
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from '../slices/registerSlice';

export const registerWithStateUseCase = async (
  dispatch: AppDispatch,
  credentials: RegisterCredentials
): Promise<Result<any>> => {
  try {
    console.log('🏗️ Register State UseCase - Starting registration with Redux');

    dispatch(registerStart());

    const result = await registerUseCase(credentials);

    if (result.success && result.data) {
      dispatch(registerSuccess(result.data));

      const storageResult = saveRegisteredUserToStorage(result.data);
      if (!storageResult.success) {
        console.warn('⚠️ Register State UseCase - Failed to save to storage:', storageResult.error);
      }

      console.log('✅ Register State UseCase - Registration successful');
      return result;
    } else {
      dispatch(registerFailure(result.error || 'Registration failed'));
      console.error('❌ Register State UseCase - Registration failed:', result.error);
      return result;
    }
  } catch (error: any) {
    dispatch(registerFailure('Registration process failed'));
    console.error('❌ Register State UseCase - Unexpected error:', error);
    return {
      success: false,
      error: 'Registration process failed'
    };
  }
};