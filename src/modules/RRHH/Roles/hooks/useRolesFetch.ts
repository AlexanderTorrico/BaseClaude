import { useState } from 'react';
import { store } from '@/store';
import { IRoleService } from '../services/IRoleService';
import { CreateRoleDto } from '../models/CreateRoleDto';
import { UpdateRoleDto } from '../models/UpdateRoleDto';
import { setRoles, addRole, updateRole as updateRoleAction, removeRole } from '../slices/roleSlice';

export const useRolesFetch = (service: IRoleService) => {
    const [loading, setLoading] = useState(false);

    const fetchAllRoles = async (): Promise<void> => {
        const result = await service.getAllRoles(setLoading);
        store.dispatch(setRoles(result.data));
    };

    const createRole = async (dto: CreateRoleDto): Promise<{ success: boolean; message: string }> => {
        const result = await service.createRole(dto.name, dto.detail, setLoading);

        if (result.status !== 200) {
            console.error(`❌ Error creating role: [${result.status}] ${result.message}`);
            return {
                success: false,
                message: result.message || 'Error al crear el rol',
            };
        }

        if (result.data) {
            store.dispatch(addRole(result.data));
        }

        return {
            success: true,
            message: 'Rol creado exitosamente',
        };
    };

    const updateRoleData = async (dto: UpdateRoleDto): Promise<{ success: boolean; message: string }> => {
        const result = await service.updateRole(dto.id, dto.name, dto.detail, setLoading);

        if (result.status !== 200) {
            console.error(`❌ Error updating role: [${result.status}] ${result.message}`);
            return {
                success: false,
                message: result.message || 'Error al actualizar el rol',
            };
        }

        if (result.data) {
            store.dispatch(updateRoleAction(result.data));
        }

        return {
            success: true,
            message: 'Rol actualizado exitosamente',
        };
    };

    const deleteRoleData = async (roleId: number): Promise<{ success: boolean; message: string }> => {
        const result = await service.deleteRole(roleId, setLoading);

        if (result.status !== 200) {
            console.error(`❌ Error deleting role: [${result.status}] ${result.message}`);
            return {
                success: false,
                message: result.message || 'Error al eliminar el rol',
            };
        }

        store.dispatch(removeRole(roleId));

        return {
            success: true,
            message: 'Rol eliminado exitosamente',
        };
    };

    return {
        loading,
        fetchAllRoles,
        createRole,
        updateRoleData,
        deleteRoleData,
    };
};
