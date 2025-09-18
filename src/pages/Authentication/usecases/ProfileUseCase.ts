// ==========================================
// PROFILE USE CASE
// ==========================================

import {
  AuthUser,
  IAuthRepository,
  IProfileUseCase
} from '../models';

export class ProfileUseCase implements IProfileUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async getCurrentProfile(): Promise<AuthUser | null> {
    try {
      return await this.authRepository.getCurrentUser();
    } catch (error) {
      return null;
    }
  }

  async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    try {
      const currentUser = await this.getCurrentProfile();

      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      // Update profile through repository
      const updatedUser = await this.authRepository.updateProfile(currentUser.id, data);

      return updatedUser;

    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  }
}