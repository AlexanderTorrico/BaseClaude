import { AuthUser, LoginResult, LoginEntity, ILoginRepository } from '@/models/login';
import { IBackendService } from '@/services';

// Adapter Pattern - Translates between domain and external API
export class LoginApiAdapter implements ILoginRepository {
  constructor(private backendService: IBackendService) {}

  async authenticate(login: LoginEntity): Promise<LoginResult> {
    try {
      // Validate business rules first
      if (!login.isValid()) {
        const errors = login.getValidationErrors();
        return LoginResult.failure(errors.join(', '));
      }

      // Call external service
      const response = await this.backendService.login(login.toRequest());

      if (response.success && response.data) {
        // Adapt external response to domain entity
        const authUser = this.adaptResponseToAuthUser(response.data);
        return LoginResult.success(authUser);
      }

      return LoginResult.failure(response.message || 'Login failed');
    } catch (error: any) {
      return LoginResult.failure(this.adaptErrorMessage(error));
    }
  }

  async saveSession(user: AuthUser): Promise<void> {
    try {
      localStorage.setItem('authUser', JSON.stringify(user.toPersistence()));
      localStorage.setItem('authToken', user.token);
    } catch (error) {
      throw new Error('Failed to save user session');
    }
  }

  async clearSession(): Promise<void> {
    try {
      localStorage.removeItem('authUser');
      localStorage.removeItem('authToken');
    } catch (error) {
      throw new Error('Failed to clear user session');
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const userData = localStorage.getItem('authUser');
      if (!userData) return null;

      const parsedData = JSON.parse(userData);
      return AuthUser.fromPersistence(parsedData);
    } catch (error) {
      return null;
    }
  }

  // Private adaptation methods
  private adaptResponseToAuthUser(responseData: any): AuthUser {
    return new AuthUser(
      responseData.user.id,
      responseData.user.name,
      responseData.user.email,
      responseData.user.role || 'user',
      responseData.token,
      responseData.refreshToken
    );
  }

  private adaptErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred during login';
  }
}