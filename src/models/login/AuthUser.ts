// Domain Entity - Authenticated User
export class AuthUser {
  readonly id: string | number;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly token: string;
  readonly refreshToken?: string;

  constructor(
    id: string | number,
    name: string,
    email: string,
    role: string,
    token: string,
    refreshToken?: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.token = token;
    this.refreshToken = refreshToken;
  }

  // Business rules
  isTokenValid(): boolean {
    // Simple token validation - you can enhance this
    return this.token.length > 0;
  }

  hasRole(requiredRole: string): boolean {
    return this.role === requiredRole;
  }

  getDisplayName(): string {
    return this.name || this.email;
  }

  // Persistence methods
  toPersistence() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      token: this.token,
      refreshToken: this.refreshToken
    };
  }

  static fromPersistence(data: any): AuthUser {
    return new AuthUser(
      data.id,
      data.name,
      data.email,
      data.role || 'user',
      data.token,
      data.refreshToken
    );
  }
}