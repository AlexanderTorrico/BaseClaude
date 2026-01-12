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

    const newId = this.nextId++;
    const newUser: UserModel = {
      id: newId,
      uuid: `mock-uuid-${newId}-${Date.now()}`,
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

  async updateUser(
    formData: FormData,
    setLoading?: SetStateFn
  ): Promise<ApiResponse<UserModel>> {
    setLoading?.(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const uuid = formData.get('uuid') as string;
    const userIndex = this.mockUsers.findIndex(u => u.uuid === uuid);

    if (userIndex === -1) {
      setLoading?.(false);
      return {
        status: 404,
        message: 'Usuario no encontrado',
        data: null as unknown as UserModel,
      };
    }

    // Verificar email duplicado (excluyendo el usuario actual)
    const email = formData.get('email') as string;
    const existingUser = this.mockUsers.find(u => u.email === email && u.uuid !== uuid);
    if (existingUser) {
      setLoading?.(false);
      return {
        status: 400,
        message: 'El email ya está registrado por otro usuario',
        data: null as unknown as UserModel,
      };
    }

    // Parsear workStation si viene como JSON
    let workStation = this.mockUsers[userIndex].workStation;
    const workStationJson = formData.get('workStation') as string;
    if (workStationJson) {
      try {
        const parsed = JSON.parse(workStationJson);
        workStation = {
          id: parsed.id || workStation?.id || 999,
          name: parsed.name || workStation?.name || 'Sin asignar',
          level: workStation?.level,
          dependencyId: parsed.dependency_id || null,
        };
      } catch {
        // Mantener workStation actual si el JSON es inválido
      }
    }

    // Actualizar usuario manteniendo datos existentes
    const currentUser = this.mockUsers[userIndex];
    const updatedUser: UserModel = {
      ...currentUser,
      name: formData.get('name') as string || currentUser.name,
      lastName: formData.get('lastName') as string || currentUser.lastName,
      fullName: `${formData.get('name') || currentUser.name} ${formData.get('lastName') || currentUser.lastName}`.trim(),
      email: email || currentUser.email,
      phone: formData.get('phone') as string || currentUser.phone,
      avatar: formData.get('avatar') ? 'mock-avatar-updated.png' : currentUser.avatar,
      workStation,
    };

    this.mockUsers[userIndex] = updatedUser;

    setLoading?.(false);

    return {
      status: 200,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser,
    };
  }
}
