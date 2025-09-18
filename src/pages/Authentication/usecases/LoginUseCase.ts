// ==========================================
// LOGIN USE CASE
// ==========================================

import {
  LoginEntity,
  AuthUser,
  LoginResult,
  IAuthRepository,
  ILoginUseCase
} from '../models';

// Use Case - Business Logic Layer (Single Responsibility Principle)
export class LoginUseCase implements ILoginUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private onSuccess?: (user: AuthUser) => void,
    private onError?: (error: string) => void
  ) {}

  async execute(
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<LoginResult> {
    try {
      // Create domain entity
      const loginEntity = new LoginEntity(email, password, rememberMe);

      // Execute business logic
      const result = await this.authRepository.authenticate(loginEntity);

      if (result.isSuccess()) {
        const user = result.getUser();

        // SIEMPRE guardar sesión para que funcione Authmiddleware
        // (rememberMe solo afecta la persistencia a largo plazo)
        await this.authRepository.saveSession(user);

        // Execute success callback
        this.onSuccess?.(user);

        return result;
      }

      // Execute error callback
      this.onError?.(result.getError());
      return result;

    } catch (error: any) {
      const errorMessage = error.message || 'Login failed unexpectedly';
      this.onError?.(errorMessage);
      return LoginResult.failure(errorMessage);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authRepository.clearSession();
    } catch (error: any) {
      throw new Error('Logout failed: ' + error.message);
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      return await this.authRepository.getCurrentUser();
    } catch (error) {
      return null;
    }
  }

  async isUserAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user !== null && user.isTokenValid();
    } catch (error) {
      return false;
    }
  }

  async refreshSession(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return false;

      // Here you could implement token refresh logic
      // For now, just validate existing token
      return user.isTokenValid();
    } catch (error) {
      return false;
    }
  }
}