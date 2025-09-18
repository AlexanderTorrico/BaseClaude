// ==========================================
// REGISTER USE CASE
// ==========================================

import {
  RegisterEntity,
  LoginResult,
  IAuthRepository,
  IRegisterUseCase
} from '../models';

export class RegisterUseCase implements IRegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<LoginResult> {
    try {
      // Create domain entity
      const registerEntity = new RegisterEntity(name, email, password, confirmPassword);

      // Execute business logic through repository
      const result = await this.authRepository.register(registerEntity);

      if (result.isSuccess()) {
        const user = result.getUser();
        // Automatically save session after successful registration
        await this.authRepository.saveSession(user);
      }

      return result;

    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed unexpectedly';
      return LoginResult.failure(errorMessage);
    }
  }
}