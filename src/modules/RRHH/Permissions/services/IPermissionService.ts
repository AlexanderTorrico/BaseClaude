import { PermissionModel } from '../models/PermissionModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interfaz del servicio de permisos
 */
export interface IPermissionService {
    /**
     * Obtiene todos los permisos
     */
    getAllPermissions(setLoading?: SetStateFn): Promise<ApiResponse<PermissionModel[]>>;

    /**
     * Crea un nuevo permiso
     */
    createPermission(name: string, description?: string, gblModuleId?: number, setLoading?: SetStateFn): Promise<ApiResponse<PermissionModel | null>>;

    /**
     * Asigna un permiso a un usuario
     */
    assignPermissionToUser(userId: number, permissionId: number, isCompany?: boolean, setLoading?: SetStateFn): Promise<ApiResponse<any>>;

    /**
     * Remueve un permiso de un usuario
     */
    removePermissionFromUser(userId: number, permissionId: number, setLoading?: SetStateFn): Promise<ApiResponse<any>>;

    /**
     * Obtiene los permisos asignados a un usuario
     */
    getUserPermissions(userId: number, setLoading?: SetStateFn): Promise<ApiResponse<PermissionModel[]>>;
}
