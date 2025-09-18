import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IBackendService, ApiResponse, BackendConfig } from '@/models/api.types';
import { User, CreateUserRequest, UpdateUserRequest, UsersResponse } from '@/models/user.types';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/models/auth.types';

export class RealBackendService implements IBackendService {
  private api: AxiosInstance;

  constructor(config: BackendConfig) {
    this.api = axios.create({
      baseURL: config.baseURL || import.meta.env.VITE_APP_API_URL || 'http://localhost:3001/api',
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private async handleRequest<T>(request: Promise<AxiosResponse<ApiResponse<T>>>): Promise<ApiResponse<T>> {
    try {
      const response = await request;
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        message: error.message || 'Network error',
        status: error.response?.status || 500,
      };
    }
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.handleRequest(
      this.api.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    );
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.handleRequest(
      this.api.post<ApiResponse<AuthResponse>>('/auth/register', userData)
    );
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.handleRequest(
      this.api.post<ApiResponse>('/auth/forgot-password', { email })
    );
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.handleRequest(
      this.api.get<ApiResponse<User>>('/auth/profile')
    );
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.handleRequest(
      this.api.put<ApiResponse<User>>('/auth/profile', data)
    );
  }

  async getUsers(filters?: any): Promise<ApiResponse<UsersResponse>> {
    return this.handleRequest(
      this.api.get<ApiResponse<UsersResponse>>('/users', { params: filters })
    );
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.handleRequest(
      this.api.post<ApiResponse<User>>('/users', userData)
    );
  }

  async updateUser(id: string | number, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.handleRequest(
      this.api.put<ApiResponse<User>>(`/users/${id}`, userData)
    );
  }

  async deleteUser(id: string | number): Promise<ApiResponse> {
    return this.handleRequest(
      this.api.delete<ApiResponse>(`/users/${id}`)
    );
  }
}