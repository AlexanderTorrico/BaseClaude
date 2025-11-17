import { IUserService } from './IUserService';
import { UserModel } from '../models/UserModel';
import { MOCK_USERS_WITH_ROLES } from '../data/mockUsersWithRoles';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

export class UserMockService implements IUserService {
  private mockUsers: UserModel[] = [...MOCK_USERS_WITH_ROLES];
  private nextId: number = 11; // El último ID en mockUsersWithRoles es 10

  async getUsersByCompany(
    companyId: number,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<UserModel[]>> {
    setLoading?.(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    setLoading?.(false);

    return {
      status: 200,
      message: 'Success',
      data: [...this.mockUsers],
    };
  }

  async registerUser(
    formData: FormData,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<UserModel>> {
    setLoading?.(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const email = formData.get('email') as string;
    const existingUser = this.mockUsers.find(u => u.email === email);
    if (existingUser) {
      setLoading?.(false);
      return {
        status: 400,
        message: 'El email ya está registrado',
        data: null as unknown as UserModel,
      };
    }

    const newUser: UserModel = {
      id: this.nextId++,
      fullName: `${formData.get('name')} ${formData.get('lastName')}`.trim(),
      name: formData.get('name') as string,
      lastName: formData.get('lastName') as string,
      email: email,
      phone: formData.get('phone') as string,
      avatar: formData.get('avatar') ? 'mock-avatar.png' : null,
      workStation: {
        id: 999,
        name: 'Sin asignar',
      },
      roleIds: [],
      roles: [],
      permissionIds: [],
      permissions: [],
    };

    this.mockUsers.push(newUser);

    setLoading?.(false);

    return {
      status: 200,
      message: 'Usuario registrado exitosamente',
      data: newUser,
    };
  }
}
