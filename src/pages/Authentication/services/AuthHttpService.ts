// ==========================================
// AUTHENTICATION HTTP SERVICE
// Dedicated HTTP service for authentication operations
// ==========================================

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, LoginRequest, RegisterRequest, AuthResponse } from '../models';

// HTTP Configuration
interface AuthHttpConfig {
  baseURL?: string;
  timeout?: number;
  debug?: boolean;
}

// Authentication HTTP Service
export class AuthHttpService {
  private api: AxiosInstance;
  private debug: boolean;

  constructor(config?: AuthHttpConfig) {
    const baseURL = config?.baseURL ||
                   import.meta.env.VITE_APP_API_URL ||
                   import.meta.env.VITE_API_BASE_URL;

    this.debug = config?.debug || import.meta.env.VITE_DEBUG_API === 'true';
    this.api = axios.create({
      baseURL,
      timeout: config?.timeout || import.meta.env.VITE_API_TIMEOUT || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();

    if (this.debug) {
      console.log('🔧 AuthHttpService initialized with baseURL:', baseURL);
    }
  }

  // ==========================================
  // INTERCEPTORS SETUP
  // ==========================================

  private setupInterceptors(): void {
    // Request interceptor - Add auth token and logging
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (this.debug) {
          console.log('📤 Auth Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            headers: config.headers,
            data: config.data
          });
        }

        return config;
      },
      (error) => {
        if (this.debug) {
          console.error('❌ Auth Request Error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors and logging
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        if (this.debug) {
          console.log('📥 Auth Response:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data
          });
        }
        return response;
      },
      (error) => {
        if (this.debug) {
          console.error('❌ Auth Response Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
          });
        }

        // Handle 401 - Unauthorized
        if (error.response?.status === 401) {
          this.clearAuthData();
          this.redirectToLogin();
        }

        return Promise.reject(error);
      }
    );
  }

  // ==========================================
  // AUTH UTILITY METHODS
  // ==========================================

  private clearAuthData(): void {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      if (this.debug) {
        console.log('🧹 Auth data cleared from localStorage');
      }
    } catch (error) {
      if (this.debug) {
        console.error('❌ Error clearing auth data:', error);
      }
    }
  }

  private redirectToLogin(): void {
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
      if (this.debug) {
        console.log('🔄 Redirecting to login page');
      }
    }
  }

  // ==========================================
  // HTTP REQUEST HANDLER
  // ==========================================

  private async handleRequest<T>(
    request: Promise<AxiosResponse<ApiResponse<T>>>,
    operation: string
  ): Promise<ApiResponse<T>> {
    try {
      if (this.debug) {
        console.log(`🚀 Starting ${operation}...`);
      }

      const response = await request;

      if (this.debug) {
        console.log(`✅ ${operation} successful:`, response.data);
      }

      return response.data;
    } catch (error: any) {
      if (this.debug) {
        console.error(`❌ ${operation} failed:`, error);
      }

      // Return structured error response
      if (error.response?.data) {
        throw error.response.data;
      }

      throw {
        success: false,
        message: error.message || `${operation} failed`,
        status: error.response?.status || 500,
      };
    }
  }

  // ==========================================
  // AUTHENTICATION API METHODS
  // ==========================================

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.handleRequest(
      this.api.post<ApiResponse<AuthResponse>>('/login', credentials),
      'Login'
    );
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.handleRequest(
      this.api.post<ApiResponse<AuthResponse>>('/auth/register', userData),
      'Register'
    );
  }

  /**
   * Send forgot password email
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.handleRequest(
      this.api.post<ApiResponse>('/auth/forgot-password', { email }),
      'Forgot Password'
    );
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<any>> {
    return this.handleRequest(
      this.api.get<ApiResponse<any>>('/auth/profile'),
      'Get Profile'
    );
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<any>): Promise<ApiResponse<any>> {
    return this.handleRequest(
      this.api.put<ApiResponse<any>>('/auth/profile', data),
      'Update Profile'
    );
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    return this.handleRequest(
      this.api.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken }),
      'Refresh Token'
    );
  }

  /**
   * Logout user (if backend endpoint exists)
   */
  async logout(): Promise<ApiResponse> {
    return this.handleRequest(
      this.api.post<ApiResponse>('/auth/logout'),
      'Logout'
    );
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!this.api.defaults.baseURL;
  }

  /**
   * Get current base URL
   */
  getBaseURL(): string {
    return this.api.defaults.baseURL || '';
  }

  /**
   * Update configuration
   */
  updateConfig(config: AuthHttpConfig): void {
    if (config.baseURL) {
      this.api.defaults.baseURL = config.baseURL;
    }
    if (config.timeout) {
      this.api.defaults.timeout = config.timeout;
    }
    if (config.debug !== undefined) {
      this.debug = config.debug;
    }

    if (this.debug) {
      console.log('🔧 AuthHttpService configuration updated:', {
        baseURL: this.api.defaults.baseURL,
        timeout: this.api.defaults.timeout,
        debug: this.debug
      });
    }
  }
}