// ==========================================
// AUTHENTICATION API ADAPTER
// ==========================================

import {
  AuthUser,
  LoginResult,
  LoginEntity,
  RegisterEntity,
  ForgotPasswordEntity,
  IAuthRepository
} from '../models';
import { AuthHttpService } from '../services/AuthHttpService';

// Adapter Pattern - Translates between domain and external API
export class AuthApiAdapter implements IAuthRepository {
  private authHttpService: AuthHttpService;

  constructor() {
    // Initialize dedicated auth HTTP service
    this.authHttpService = new AuthHttpService({
      baseURL: import.meta.env.VITE_APP_API_URL || import.meta.env.VITE_API_BASE_URL,
      timeout: import.meta.env.VITE_API_TIMEOUT,
      debug: import.meta.env.VITE_DEBUG_API === 'true'
    });
  }

  // ==========================================
  // AUTHENTICATION METHODS
  // ==========================================

  async authenticate(login: LoginEntity): Promise<LoginResult> {
    try {
      // Validate business rules first
      if (!login.isValid()) {
        const errors = login.getValidationErrors();
        return LoginResult.failure(errors.join(', '));
      }

      // Call dedicated auth HTTP service
      const response = await this.authHttpService.login(login.toRequest());

      if (response.status === 200 && response.data) {
        // Adapt external response to domain entity
        const authUser = this.adaptResponseToAuthUser(response.data);
        return LoginResult.success(authUser);
      }

      return LoginResult.failure(response.message || 'Login failed');
    } catch (error: any) {
      return LoginResult.failure(this.adaptErrorMessage(error));
    }
  }

  async register(register: RegisterEntity): Promise<LoginResult> {
    try {
      // Validate business rules first
      if (!register.isValid()) {
        const errors = register.getValidationErrors();
        return LoginResult.failure(errors.join(', '));
      }

      // Call dedicated auth HTTP service
      const response = await this.authHttpService.register(register.toRequest());

      if (response.status === 200 && response.data) {
        // Adapt external response to domain entity
        const authUser = this.adaptResponseToAuthUser(response.data);
        return LoginResult.success(authUser);
      }

      return LoginResult.failure(response.message || 'Registration failed');
    } catch (error: any) {
      return LoginResult.failure(this.adaptErrorMessage(error));
    }
  }

  async forgotPassword(forgotPassword: ForgotPasswordEntity): Promise<{ success: boolean; message: string }> {
    try {
      // Validate business rules first
      const validationError = forgotPassword.getValidationError();
      if (validationError) {
        return { success: false, message: validationError };
      }

      // Call dedicated auth HTTP service
      const response = await this.authHttpService.forgotPassword(forgotPassword.email);

      return {
        success: response.status === 200,
        message: response.message || 'Reset link sent to your mailbox'
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.adaptErrorMessage(error)
      };
    }
  }

  // ==========================================
  // SESSION MANAGEMENT
  // ==========================================

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

  async updateProfile(userId: string | number, data: Partial<AuthUser>): Promise<AuthUser> {
    try {
      const response = await this.authHttpService.updateProfile(data);

      if (response.status === 200 && response.data) {
        // Update local storage
        const currentUser = await this.getCurrentUser();
        if (currentUser) {
          const updatedUser = new AuthUser(
            currentUser.id,
            data.name || currentUser.name,
            data.lastName || currentUser.lastName,
            data.lastNameMother || currentUser.lastNameMother,
            data.email || currentUser.email,
            data.privilege || currentUser.privilege,
            data.phone || currentUser.phone,
            data.logo || currentUser.logo,
            data.language || currentUser.language,
            data.status || currentUser.status,
            currentUser.token,
            currentUser.modules,
            currentUser.roles,
            currentUser.permissions
          );
          await this.saveSession(updatedUser);
          return updatedUser;
        }
      }

      throw new Error(response.message || 'Profile update failed');
    } catch (error: any) {
      throw new Error(this.adaptErrorMessage(error));
    }
  }

  // ==========================================
  // PRIVATE ADAPTATION METHODS
  // ==========================================

  private adaptResponseToAuthUser(responseData: any): AuthUser {
    // Mapeo específico para tu estructura API
    const userData = responseData.data; // Tu estructura tiene data.data
    return new AuthUser(
      userData.id,
      userData.name,
      userData.last_name,
      userData.last_name_mother,
      userData.email,
      userData.privilege,
      userData.phone,
      userData.logo,
      userData.language,
      userData.status,
      responseData.access_token, // El token viene en el nivel superior
      responseData.modules || [],
      responseData.roles || [],
      responseData.direct_permissions || []
    );
  }

  private adaptErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}