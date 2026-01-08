import { useState } from 'react';
import { store } from '@/store';
import { IPermissionService } from '../services/IPermissionService';
import { CreatePermissionDto } from '../models/CreatePermissionDto';
import { setPermissions, addPermission } from '../slices/permissionSlice';

export const usePermissionsFetch = (service: IPermissionService) => {
    const [loading, setLoading] = useState(false);

    const fetchAllPermissions = async (): Promise<void> => {
        const result = await service.getAllPermissions(setLoading);
        store.dispatch(setPermissions(result.data));
    };

    const createPermission = async (dto: CreatePermissionDto): Promise<{ success: boolean; message: string }> => {
        const result = await service.createPermission(dto.name, dto.description, dto.gbl_module_id, setLoading);

        if (result.status !== 200) {
            console.error(`❌ Error creating permission: [${result.status}] ${result.message}`);
            return {
                success: false,
                message: result.message || 'Error al crear el permiso',
            };
        }

        if (result.data) {
            store.dispatch(addPermission(result.data));
        }

        return {
            success: true,
            message: 'Permiso creado exitosamente',
        };
    };

    return {
        loading,
        fetchAllPermissions,
        createPermission,
    };
};
