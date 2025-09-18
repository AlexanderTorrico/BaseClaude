// Domain Entity - Login Business Logic
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

  // Value object conversion
  toRequest() {
    return {
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    };
  }
}