// ==========================================
// AUTHENTICATION SERVICE FACTORY
// ==========================================

import { AuthApiAdapter } from '../adapters';
import {
  LoginUseCase,
  RegisterUseCase,
  ForgotPasswordUseCase,
  ProfileUseCase
} from '../usecases';
import {
  AuthUser,
  IAuthRepository,
  ILoginUseCase,
  IRegisterUseCase,
  IForgotPasswordUseCase,
  IProfileUseCase
} from '../models';

// Factory Pattern - Service creation with dependency injection
export class AuthServiceFactory {
  private static authRepository: IAuthRepository | null = null;

  // ==========================================
  // USE CASE FACTORIES
  // ==========================================

  // Login Use Case Factory
  static createLoginUseCase(
    onSuccess?: (user: AuthUser) => void,
    onError?: (error: string) => void
  ): ILoginUseCase {
    const repository = this.getAuthRepository();
    return new LoginUseCase(repository, onSuccess, onError);
  }

  // Register Use Case Factory
  static createRegisterUseCase(): IRegisterUseCase {
    const repository = this.getAuthRepository();
    return new RegisterUseCase(repository);
  }

  // Forgot Password Use Case Factory
  static createForgotPasswordUseCase(): IForgotPasswordUseCase {
    const repository = this.getAuthRepository();
    return new ForgotPasswordUseCase(repository);
  }

  // Profile Use Case Factory
  static createProfileUseCase(): IProfileUseCase {
    const repository = this.getAuthRepository();
    return new ProfileUseCase(repository);
  }

  // ==========================================
  // REPOSITORY MANAGEMENT
  // ==========================================

  // Lazy initialization of repository
  private static getAuthRepository(): IAuthRepository {
    if (!this.authRepository) {
      // Create dedicated auth repository with HTTP service
      this.authRepository = new AuthApiAdapter();
    }
    return this.authRepository;
  }

  // For testing purposes - allows injection of mock repository
  static setAuthRepository(repository: IAuthRepository): void {
    this.authRepository = repository;
  }

  // Reset factory (useful for testing)
  static reset(): void {
    this.authRepository = null;
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      const loginUseCase = this.createLoginUseCase();
      return await loginUseCase.isUserAuthenticated();
    } catch (error) {
      return false;
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const loginUseCase = this.createLoginUseCase();
      return await loginUseCase.getCurrentUser();
    } catch (error) {
      return null;
    }
  }

  // Logout current user
  static async logout(): Promise<void> {
    try {
      const loginUseCase = this.createLoginUseCase();
      await loginUseCase.logout();
    } catch (error) {
      throw new Error('Logout failed');
    }
  }
}