// ==========================================
// AUTHENTICATION INTERFACES & CONTRACTS
// ==========================================

import { LoginEntity, AuthUser, LoginResult, RegisterEntity, ForgotPasswordEntity } from './AuthModels';

// Repository Interfaces (Dependency Inversion Principle)
export interface IAuthRepository {
  authenticate(login: LoginEntity): Promise<LoginResult>;
  register(register: RegisterEntity): Promise<LoginResult>;
  forgotPassword(forgotPassword: ForgotPasswordEntity): Promise<{ success: boolean; message: string }>;
  saveSession(user: AuthUser): Promise<void>;
  clearSession(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  updateProfile(userId: string | number, data: Partial<AuthUser>): Promise<AuthUser>;
}

// Use Case Interfaces (Interface Segregation Principle)
export interface ILoginUseCase {
  execute(email: string, password: string, rememberMe?: boolean): Promise<LoginResult>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  isUserAuthenticated(): Promise<boolean>;
}

export interface IRegisterUseCase {
  execute(name: string, email: string, password: string, confirmPassword: string): Promise<LoginResult>;
}

export interface IForgotPasswordUseCase {
  execute(email: string): Promise<{ success: boolean; message: string }>;
}

export interface IProfileUseCase {
  getCurrentProfile(): Promise<AuthUser | null>;
  updateProfile(data: Partial<AuthUser>): Promise<AuthUser>;
}

// State Interfaces
export interface AuthState {
  // Login State
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;

  // Register State
  registrationSuccess: boolean;
  registrationError: string | null;

  // Forgot Password State
  forgetSuccessMsg: string | null;
  forgetError: string | null;

  // Profile State
  profileSuccess: string | null;
  profileError: string | null;
}

// API Response Types - Basado en tu estructura real
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Estructura específica de tu API
export interface UserData {
  id: number;
  name: string;
  last_name: string;
  last_name_mother: string;
  email: string;
  email_verified_at: string | null;
  token: string | null;
  privilege: string;
  phone: string | null;
  logo: string | null;
  language: string;
  status: number;
  user_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface ModuleData {
  id: number;
  name: string;
  description: string;
  icon: string;
  path: string;
  color: string;
  img: string;
  weight_for_edit: number;
  type: string | null;
  module_company_id: number;
  with_web_editor: number;
  steps: any[];
}

export interface AuthResponse {
  access_token: string;
  modules: ModuleData[];
  roles: any[];
  direct_permissions: any[];
  data: UserData;
}

export interface ForgotPasswordRequest {
  email: string;
}