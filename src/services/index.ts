export { BackendServiceFactory } from './backendService';
export { FakeBackendService } from './fakeBackendService';
export { RealBackendService } from './realBackendService';
export type { IBackendService } from './backendService';
export { BackendType } from '@/models/api.types';
export { createApiInstance, handleRequest } from './httpService';
export type { HttpConfig } from './httpService';