import { AuthUser } from './AuthUser';

// Domain Value Object - Login Operation Result
export class LoginResult {
  readonly success: boolean;
  readonly user?: AuthUser;
  readonly error?: string;
  readonly timestamp: Date;

  private constructor(
    success: boolean,
    user?: AuthUser,
    error?: string
  ) {
    this.success = success;
    this.user = user;
    this.error = error;
    this.timestamp = new Date();
  }

  static success(user: AuthUser): LoginResult {
    return new LoginResult(true, user);
  }

  static failure(error: string): LoginResult {
    return new LoginResult(false, undefined, error);
  }

  isSuccess(): boolean {
    return this.success && this.user !== undefined;
  }

  isFailure(): boolean {
    return !this.success;
  }

  getUser(): AuthUser {
    if (!this.user) {
      throw new Error('Cannot get user from failed login result');
    }
    return this.user;
  }

  getError(): string {
    return this.error || 'Unknown error occurred';
  }
}