import { useState } from 'react';
import { store } from '@/store';
import { IUserService } from '../services/IUserService';
import { RegisterUserDto } from '../models/RegisterUserDto';
import { UpdateUserDto } from '../models/UpdateUserDto';
import { setUsers, addUser, updateUser as updateUserAction } from '../slices/userSlice';
import { PermissionApiService } from '../../Permissions/services/PermissionApiService';

const permissionService = new PermissionApiService();

export const useUsersFetch = (service: IUserService) => {
  const [loading, setLoading] = useState(false);

  const fetchUsersByCompany = async (companyId: number): Promise<void> => {
    try {
      const result = await service.getUsersByCompany(companyId, setLoading);

      if (!result.data || !Array.isArray(result.data)) {
        store.dispatch(setUsers(result.data || []));
        return;
      }

      // Intentar cargar permisos para cada usuario
      try {
        const usersWithPermissions = await Promise.all(
          result.data.map(async (user) => {
            try {
              const permissionsResult = await permissionService.getUserPermissions(user.uuid);
              return {
                ...user,
                permissions: permissionsResult.data || [],
                permissionIds: (permissionsResult.data || []).map(p => p.id)
              };
            } catch (err) {
              console.warn(`Could not load permissions for user ${user.uuid}`);
              return { ...user, permissions: [], permissionIds: [] };
            }
          })
        );
        store.dispatch(setUsers(usersWithPermissions));
      } catch (permError) {
        // Si falla la carga de permisos, al menos mostrar los usuarios
        console.error('Error loading user permissions:', permError);
        store.dispatch(setUsers(result.data));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      store.dispatch(setUsers([]));
    }
  };

  const registerUser = async (dto: RegisterUserDto): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData();
    formData.append('name', dto.name);
    formData.append('lastName', dto.lastName);
    formData.append('phone', dto.phone);
    formData.append('email', dto.email);
    formData.append('password', dto.password);
    formData.append('repeatPassword', dto.repeatPassword);
    formData.append('gbl_company_id', dto.gbl_company_id);
    formData.append('workStation', dto.workStation);

    if (dto.avatar) {
      formData.append('avatar', dto.avatar);
    }

    const result = await service.registerUser(formData, setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error registering user: [${result.status}] ${result.message}`);
      return {
        success: false,
        message: result.message || 'Error al registrar el usuario',
      };
    }

    if (result.data) {
      store.dispatch(addUser(result.data));
    }

    return {
      success: true,
      message: 'Usuario registrado exitosamente',
    };
  };

  const updateUserData = async (dto: UpdateUserDto): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData();
    formData.append('id', dto.id.toString());
    formData.append('name', dto.name);
    formData.append('lastName', dto.lastName);
    formData.append('phone', dto.phone);
    formData.append('email', dto.email);
    formData.append('gbl_company_id', dto.gbl_company_id);
    formData.append('workStation', dto.workStation);

    // Solo agregar contraseña si fue proporcionada
    if (dto.password && dto.password.trim() !== '') {
      formData.append('password', dto.password);
      formData.append('repeatPassword', dto.repeatPassword || '');
    }

    // Agregar avatar si fue proporcionado
    if (dto.avatar) {
      formData.append('avatar', dto.avatar);
    }

    const result = await service.updateUser(formData, setLoading);

    if (result.status !== 200) {
      console.error(`❌ Error updating user: [${result.status}] ${result.message}`);
      return {
        success: false,
        message: result.message || 'Error al actualizar el usuario',
      };
    }

    if (result.data) {
      store.dispatch(updateUserAction(result.data));
    }

    return {
      success: true,
      message: 'Usuario actualizado exitosamente',
    };
  };

  return {
    loading,
    fetchUsersByCompany,
    registerUser,
    updateUserData,
  };
};
