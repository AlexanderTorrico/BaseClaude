export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

export interface RegisterFormData extends RegisterCredentials {
  errors?: {
    email?: string;
    username?: string;
    password?: string;
  };
}

export interface RegisterResponse {
  status: number;
  message: string;
  data: {
    id: string;
    email: string;
    username: string;
    token?: string;
    [key: string]: any;
  };
}

export interface RegisterState {
  isRegistered: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
  registrationDate?: string;
}

export interface Result<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}