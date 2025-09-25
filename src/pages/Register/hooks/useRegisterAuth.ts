import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RegisterCredentials } from '../types/registerTypes';
import { registerWithStateUseCase } from '../usecases/registerStateUseCase';
import {
  clearRegisterError,
  clearRegistration,
  resetRegisterState,
  selectIsRegistered,
  selectRegisteredUser,
  selectRegisterLoading,
  selectRegisterError,
  selectRegistrationDate,
} from '../slices/registerSlice';

export const useRegisterAuth = () => {
  const dispatch = useAppDispatch();

  const isRegistered = useAppSelector(selectIsRegistered);
  const user = useAppSelector(selectRegisteredUser);
  const isLoading = useAppSelector(selectRegisterLoading);
  const error = useAppSelector(selectRegisterError);
  const registrationDate = useAppSelector(selectRegistrationDate);

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        console.log('🎯 useRegisterAuth - Starting registration process');
        const result = await registerWithStateUseCase(dispatch, credentials);
        return result;
      } catch (error: any) {
        console.error('❌ useRegisterAuth - Registration failed:', error);
        return {
          success: false,
          error: error.message || 'Registration failed'
        };
      }
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearRegisterError());
  }, [dispatch]);

  const clearRegister = useCallback(() => {
    dispatch(clearRegistration());
  }, [dispatch]);

  const resetRegister = useCallback(() => {
    dispatch(resetRegisterState());
  }, [dispatch]);

  return {
    register,
    isRegistered,
    user,
    isLoading,
    error,
    registrationDate,
    clearError,
    clearRegister,
    resetRegister,
  };
};