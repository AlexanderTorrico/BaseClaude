import { IBackendService, BackendConfig } from '@/models/api.types';
import { SimpleBackendService } from './simpleBackendService';

class BackendServiceFactory {
  private static instance: IBackendService;

  static initialize(config: BackendConfig): void {
    this.instance = new SimpleBackendService(config);
  }

  static getInstance(): IBackendService {
    if (!this.instance) {
      throw new Error('BackendService not initialized. Call initialize() first.');
    }
    return this.instance;
  }
}

export { BackendServiceFactory };
export type { IBackendService };