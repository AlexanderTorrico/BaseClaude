import { IBackendService, BackendType, BackendConfig, ApiResponse } from '@/models/api.types';
import { FakeBackendService } from './fakeBackendService';
import { RealBackendService } from './realBackendService';

class BackendServiceFactory {
  private static instance: IBackendService;
  private static config: BackendConfig;

  static initialize(config: BackendConfig): void {
    this.config = config;
    this.instance = this.createBackendService(config);
  }

  static getInstance(): IBackendService {
    if (!this.instance) {
      throw new Error('BackendService not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  private static createBackendService(config: BackendConfig): IBackendService {
    switch (config.type) {
      case BackendType.FAKE:
        return new FakeBackendService();
      case BackendType.REAL:
        return new RealBackendService(config);
      default:
        throw new Error(`Unsupported backend type: ${config.type}`);
    }
  }

  static switchBackend(newType: BackendType): void {
    this.config.type = newType;
    this.instance = this.createBackendService(this.config);
  }
}

export { BackendServiceFactory };
export type { IBackendService };