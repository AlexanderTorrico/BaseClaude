import {
  LoginEntity,
  AuthUser,
  LoginResult,
  ILoginRepository,
  ILoginUseCase
} from '@/models/login';

// Use Case - Business Logic Layer (Single Responsibility Principle)
export class LoginUseCase implements ILoginUseCase {
  constructor(
    private loginRepository: ILoginRepository,
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
      const result = await this.loginRepository.authenticate(loginEntity);

      if (result.isSuccess()) {
        const user = result.getUser();

        // Save session if remember me is checked
        if (rememberMe) {
          await this.loginRepository.saveSession(user);
        }

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
      await this.loginRepository.clearSession();
    } catch (error: any) {
      throw new Error('Logout failed: ' + error.message);
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      return await this.loginRepository.getCurrentUser();
    } catch (error) {
      return null;
    }
  }

  // Additional business methods
  async isUserAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null && user.isTokenValid();
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