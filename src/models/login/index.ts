// Domain Models Exports
export { LoginEntity } from './LoginEntity';
export { AuthUser } from './AuthUser';
export { LoginResult } from './LoginResult';

// Repository Interface (Dependency Inversion Principle)
export interface ILoginRepository {
  authenticate(login: LoginEntity): Promise<LoginResult>;
  saveSession(user: AuthUser): Promise<void>;
  clearSession(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}

// Use Case Interface (Single Responsibility Principle)
export interface ILoginUseCase {
  execute(email: string, password: string, rememberMe?: boolean): Promise<LoginResult>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}