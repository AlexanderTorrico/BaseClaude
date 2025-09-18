import { IBackendService, ApiResponse } from '@/models/api.types';
import { User, CreateUserRequest, UpdateUserRequest, UsersResponse } from '@/models/user.types';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/models/auth.types';

export class FakeBackendService implements IBackendService {
  private users: User[] = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@themesbrand.com",
      role: "admin",
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "active",
      createdAt: new Date().toISOString(),
    },
  ];

  private delay(ms: number = 200): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    await this.delay();

    const user = this.users.find(u =>
      u.email === credentials.email &&
      u.status === 'active'
    );

    if (user) {
      const authResponse: AuthResponse = {
        token: 'fake-jwt-token-' + Date.now(),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };

      return {
        data: authResponse,
        success: true,
        message: 'Login successful',
      };
    }

    throw {
      message: 'Invalid email or password',
      status: 401,
    };
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    await this.delay();

    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw {
        message: 'Email already exists',
        status: 400,
      };
    }

    const newUser: User = {
      id: this.users.length + 1,
      name: userData.name,
      email: userData.email,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);

    const authResponse: AuthResponse = {
      token: 'fake-jwt-token-' + Date.now(),
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };

    return {
      data: authResponse,
      success: true,
      message: 'Registration successful',
    };
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    await this.delay();

    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw {
        message: 'Email not found',
        status: 404,
      };
    }

    return {
      data: null,
      success: true,
      message: 'Password reset email sent',
    };
  }

  async getProfile(): Promise<ApiResponse<User>> {
    await this.delay();

    // In real implementation, get user ID from token
    const user = this.users[0];

    return {
      data: user,
      success: true,
    };
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    await this.delay();

    const userIndex = this.users.findIndex(u => u.id === data.id);
    if (userIndex === -1) {
      throw {
        message: 'User not found',
        status: 404,
      };
    }

    this.users[userIndex] = { ...this.users[userIndex], ...data };

    return {
      data: this.users[userIndex],
      success: true,
      message: 'Profile updated successfully',
    };
  }

  async getUsers(filters?: any): Promise<ApiResponse<UsersResponse>> {
    await this.delay();

    let filteredUsers = [...this.users];

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }

    if (filters?.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }

    if (filters?.status) {
      filteredUsers = filteredUsers.filter(user => user.status === filters.status);
    }

    return {
      data: {
        users: filteredUsers,
        total: filteredUsers.length,
      },
      success: true,
    };
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    await this.delay();

    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw {
        message: 'Email already exists',
        status: 400,
      };
    }

    const newUser: User = {
      id: this.users.length + 1,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);

    return {
      data: newUser,
      success: true,
      message: 'User created successfully',
    };
  }

  async updateUser(id: string | number, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    await this.delay();

    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw {
        message: 'User not found',
        status: 404,
      };
    }

    this.users[userIndex] = { ...this.users[userIndex], ...userData };

    return {
      data: this.users[userIndex],
      success: true,
      message: 'User updated successfully',
    };
  }

  async deleteUser(id: string | number): Promise<ApiResponse> {
    await this.delay();

    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw {
        message: 'User not found',
        status: 404,
      };
    }

    this.users.splice(userIndex, 1);

    return {
      data: null,
      success: true,
      message: 'User deleted successfully',
    };
  }
}