// ==========================================
// FORGOT PASSWORD USE CASE
// ==========================================

import {
  ForgotPasswordEntity,
  IAuthRepository,
  IForgotPasswordUseCase
} from '../models';

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Create domain entity
      const forgotPasswordEntity = new ForgotPasswordEntity(email);

      // Execute business logic through repository
      const result = await this.authRepository.forgotPassword(forgotPasswordEntity);

      return result;

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send reset email';
      return { success: false, message: errorMessage };
    }
  }
}