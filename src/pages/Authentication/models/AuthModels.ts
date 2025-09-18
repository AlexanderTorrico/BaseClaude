// ==========================================
// AUTHENTICATION DOMAIN MODELS
// ==========================================

// Login Entity - Business Logic
export class LoginEntity {
  readonly email: string;
  readonly password: string;
  readonly rememberMe: boolean;

  constructor(email: string, password: string, rememberMe: boolean = false) {
    this.email = email;
    this.password = password;
    this.rememberMe = rememberMe;
  }

  // Business Rules
  isValid(): boolean {
    return this.isEmailValid() && this.isPasswordValid();
  }

  private isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  private isPasswordValid(): boolean {
    return this.password.length >= 6;
  }

  getValidationErrors(): string[] {
    const errors: string[] = [];
    if (!this.isEmailValid()) {
      errors.push('Please enter a valid email address');
    }
    if (!this.isPasswordValid()) {
      errors.push('Password must be at least 6 characters long');
    }
    return errors;
  }

  toRequest() {
    return {
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    };
  }
}

// Authenticated User Entity - Adaptado a tu estructura API
export class AuthUser {
  readonly id: number;
  readonly name: string;
  readonly lastName: string;
  readonly lastNameMother: string;
  readonly email: string;
  readonly privilege: string;
  readonly phone: string | null;
  readonly logo: string | null;
  readonly language: string;
  readonly status: number;
  readonly token: string;
  readonly modules: any[];
  readonly roles: any[];
  readonly permissions: any[];

  constructor(
    id: number,
    name: string,
    lastName: string,
    lastNameMother: string,
    email: string,
    privilege: string,
    phone: string | null,
    logo: string | null,
    language: string,
    status: number,
    token: string,
    modules: any[] = [],
    roles: any[] = [],
    permissions: any[] = []
  ) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.lastNameMother = lastNameMother;
    this.email = email;
    this.privilege = privilege;
    this.phone = phone;
    this.logo = logo;
    this.language = language;
    this.status = status;
    this.token = token;
    this.modules = modules;
    this.roles = roles;
    this.permissions = permissions;
  }

  isTokenValid(): boolean {
    return this.token.length > 0;
  }

  hasPrivilege(requiredPrivilege: string): boolean {
    return this.privilege === requiredPrivilege;
  }

  isActive(): boolean {
    return this.status === 1;
  }

  getDisplayName(): string {
    return `${this.name} ${this.lastName}`.trim() || this.email;
  }

  getFullName(): string {
    return `${this.name} ${this.lastName} ${this.lastNameMother}`.trim();
  }

  toPersistence() {
    return {
      id: this.id,
      name: this.name,
      lastName: this.lastName,
      lastNameMother: this.lastNameMother,
      email: this.email,
      privilege: this.privilege,
      phone: this.phone,
      logo: this.logo,
      language: this.language,
      status: this.status,
      token: this.token,
      modules: this.modules,
      roles: this.roles,
      permissions: this.permissions
    };
  }

  static fromPersistence(data: any): AuthUser {
    return new AuthUser(
      data.id,
      data.name,
      data.lastName,
      data.lastNameMother,
      data.email,
      data.privilege,
      data.phone,
      data.logo,
      data.language,
      data.status,
      data.token,
      data.modules || [],
      data.roles || [],
      data.permissions || []
    );
  }
}

// Login Result Value Object
export class LoginResult {
  readonly success: boolean;
  readonly user?: AuthUser;
  readonly error?: string;
  readonly timestamp: Date;

  private constructor(success: boolean, user?: AuthUser, error?: string) {
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

// Register Entity
export class RegisterEntity {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;

  constructor(name: string, email: string, password: string, confirmPassword: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }

  isValid(): boolean {
    return this.isNameValid() &&
           this.isEmailValid() &&
           this.isPasswordValid() &&
           this.isPasswordConfirmed();
  }

  private isNameValid(): boolean {
    return this.name.trim().length >= 2;
  }

  private isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  private isPasswordValid(): boolean {
    return this.password.length >= 6;
  }

  private isPasswordConfirmed(): boolean {
    return this.password === this.confirmPassword;
  }

  getValidationErrors(): string[] {
    const errors: string[] = [];
    if (!this.isNameValid()) {
      errors.push('Name must be at least 2 characters long');
    }
    if (!this.isEmailValid()) {
      errors.push('Please enter a valid email address');
    }
    if (!this.isPasswordValid()) {
      errors.push('Password must be at least 6 characters long');
    }
    if (!this.isPasswordConfirmed()) {
      errors.push('Passwords do not match');
    }
    return errors;
  }

  toRequest() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    };
  }
}

// Forgot Password Entity
export class ForgotPasswordEntity {
  readonly email: string;

  constructor(email: string) {
    this.email = email;
  }

  isValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  getValidationError(): string | null {
    return this.isValid() ? null : 'Please enter a valid email address';
  }

  toRequest() {
    return { email: this.email };
  }
}