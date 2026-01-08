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
     * @param userUuid - UUID del usuario (string)
     */
    assignPermissionToUser(userUuid: string, permissionId: number, isCompany?: boolean, setLoading?: SetStateFn): Promise<ApiResponse<any>>;

    /**
     * Remueve un permiso de un usuario
     * @param userUuid - UUID del usuario (string)
     */
    removePermissionFromUser(userUuid: string, permissionId: number, setLoading?: SetStateFn): Promise<ApiResponse<any>>;

    /**
     * Obtiene los permisos asignados a un usuario
     * @param userUuid - UUID del usuario (string)
     */
    getUserPermissions(userUuid: string, setLoading?: SetStateFn): Promise<ApiResponse<PermissionModel[]>>;
}
