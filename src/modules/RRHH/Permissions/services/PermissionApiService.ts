import { IPermissionService } from './IPermissionService';
import { PermissionModel } from '../models/PermissionModel';
import { adaptPermissionResponseToModel, adaptPermissionsArrayToModels, adaptUserPermissionsResponse } from '../adapters/permissionAdapter';
import { httpRequestWithAuth } from '@/services/httpService';
import { ApiResponse, transformApiData } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';

const BASE_URL = '/api/role-permission/permissions';

export class PermissionApiService implements IPermissionService {

    async getAllPermissions(setLoading?: SetStateFn): Promise<ApiResponse<PermissionModel[]>> {
        const res = await httpRequestWithAuth.get<ApiResponse<any>>(BASE_URL, setLoading);
        return transformApiData(res, (data) => adaptPermissionsArrayToModels(data?.data ?? data ?? []));
    }

    async createPermission(name: string, description?: string, gblModuleId?: number, setLoading?: SetStateFn): Promise<ApiResponse<PermissionModel | null>> {
        const body: any = { name };
        if (description) body.description = description;
        if (gblModuleId) body.gbl_module_id = gblModuleId;

        const res = await httpRequestWithAuth.post<ApiResponse<any>>(BASE_URL, body, setLoading);
        return transformApiData(res, (data) => data ? adaptPermissionResponseToModel(data?.data ?? data) : null);
    }

    /**
     * Asignar múltiples permisos a un usuario
     * @param userUuid - UUID del usuario (string)
     */
    async assignPermissionsToUser(userUuid: string, permissionIds: number[], setLoading?: SetStateFn): Promise<ApiResponse<any>> {
        const body = {
            permission_ids: permissionIds
        };

        const res = await httpRequestWithAuth.post<ApiResponse<any>>(`${BASE_URL}/user/${userUuid}/assign`, body, setLoading);
        return res;
    }

    /**
     * Remover múltiples permisos de un usuario
     * @param userUuid - UUID del usuario (string)
     */
    async removePermissionsFromUser(userUuid: string, permissionIds: number[], setLoading?: SetStateFn): Promise<ApiResponse<any>> {
        const body = {
            permission_ids: permissionIds
        };

        const res = await httpRequestWithAuth.post<ApiResponse<any>>(`${BASE_URL}/user/${userUuid}/remove`, body, setLoading);
        return res;
    }

    /**
     * Sincronizar permisos de un usuario (reemplazar todos los permisos actuales)
     * @param userUuid - UUID del usuario (string)
     */
    async syncPermissionsForUser(userUuid: string, permissionIds: number[], setLoading?: SetStateFn): Promise<ApiResponse<any>> {
        const body = {
            permission_ids: permissionIds
        };

        const res = await httpRequestWithAuth.put<ApiResponse<any>>(`${BASE_URL}/user/${userUuid}/sync`, body, setLoading);
        return res;
    }

    /**
     * Obtener permisos de un usuario
     * @param userUuid - UUID del usuario (string)
     */
    async getUserPermissions(userUuid: string, setLoading?: SetStateFn): Promise<ApiResponse<PermissionModel[]>> {
        const res = await httpRequestWithAuth.get<ApiResponse<any>>(`${BASE_URL}/user/${userUuid}`, setLoading);
        return transformApiData(res, (data) => adaptUserPermissionsResponse(data?.data ?? data ?? []));
    }

    // ============ MÉTODOS LEGACY (compatibilidad) ============

    /**
     * @deprecated Use assignPermissionsToUser instead
     */
    async assignPermissionToUser(userUuid: string, permissionId: number, isCompany: boolean = false, setLoading?: SetStateFn): Promise<ApiResponse<any>> {
        return this.assignPermissionsToUser(userUuid, [permissionId], setLoading);
    }

    /**
     * @deprecated Use removePermissionsFromUser instead
     */
    async removePermissionFromUser(userUuid: string, permissionId: number, setLoading?: SetStateFn): Promise<ApiResponse<any>> {
        return this.removePermissionsFromUser(userUuid, [permissionId], setLoading);
    }
}
