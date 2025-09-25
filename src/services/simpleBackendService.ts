import { IBackendService, BackendConfig, ApiResponse } from '@/models/api.types';
import { createApiInstance, handleRequest } from './httpService';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/models/auth.types';

export class SimpleBackendService implements IBackendService {
  private api: ReturnType<typeof createApiInstance>;

  constructor(config?: BackendConfig) {
    this.api = createApiInstance({
      baseURL: config?.baseURL,
      timeout: config?.timeout,
    });
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return handleRequest(
      this.api.post<ApiResponse<AuthResponse>>('/login', credentials)
    );
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return handleRequest(
      this.api.post<ApiResponse<AuthResponse>>('/auth/register', userData)
    );
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return handleRequest(
      this.api.post<ApiResponse>('/auth/forgot-password', { email })
    );
  }

  async getProfile(): Promise<ApiResponse> {
    return handleRequest(
      this.api.get<ApiResponse>('/auth/profile')
    );
  }

  async updateProfile(data: any): Promise<ApiResponse> {
    return handleRequest(
      this.api.put<ApiResponse>('/auth/profile', data)
    );
  }

  async getUsers(filters?: any): Promise<ApiResponse> {
    return handleRequest(
      this.api.get<ApiResponse>('/users', { params: filters })
    );
  }

  async createUser(userData: any): Promise<ApiResponse> {
    return handleRequest(
      this.api.post<ApiResponse>('/users', userData)
    );
  }

  async updateUser(id: string | number, userData: any): Promise<ApiResponse> {
    return handleRequest(
      this.api.put<ApiResponse>(`/users/${id}`, userData)
    );
  }

  async deleteUser(id: string | number): Promise<ApiResponse> {
    return handleRequest(
      this.api.delete<ApiResponse>(`/users/${id}`)
    );
  }
}