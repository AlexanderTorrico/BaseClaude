import { BackendServiceFactory } from '@/services';
import { LoginApiAdapter } from '@/adapters';
import { LoginUseCase } from '@/components/login/usecases';
import { AuthUser, ILoginRepository, ILoginUseCase } from '@/models/login';

// Factory Pattern - Service creation with dependency injection
export class LoginServiceFactory {
  private static loginRepository: ILoginRepository | null = null;

  // Dependency Injection - Creates login use case with all dependencies
  static createLoginUseCase(
    onSuccess?: (user: AuthUser) => void,
    onError?: (error: string) => void
  ): ILoginUseCase {
    const repository = this.getLoginRepository();
    return new LoginUseCase(repository, onSuccess, onError);
  }

  // Lazy initialization of repository
  private static getLoginRepository(): ILoginRepository {
    if (!this.loginRepository) {
      const backendService = BackendServiceFactory.getInstance();
      this.loginRepository = new LoginApiAdapter(backendService);
    }
    return this.loginRepository;
  }

  // For testing purposes - allows injection of mock repository
  static setLoginRepository(repository: ILoginRepository): void {
    this.loginRepository = repository;
  }

  // Reset factory (useful for testing)
  static reset(): void {
    this.loginRepository = null;
  }
}