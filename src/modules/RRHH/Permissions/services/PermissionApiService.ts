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

    async assignPermissionToUser(userId: number, permissionId: number, isCompany: boolean = false, setLoading?: SetStateFn): Promise<ApiResponse<any>> {
        const body = {
            user_id: userId,
            gbl_permission_id: permissionId,
            is_company: isCompany
        };

        const res = await httpRequestWithAuth.post<ApiResponse<any>>(`${BASE_URL}/assign-to-user`, body, setLoading);
        return res;
    }

    async removePermissionFromUser(userId: number, permissionId: number, setLoading?: SetStateFn): Promise<ApiResponse<any>> {
        const body = {
            user_id: userId,
            gbl_permission_id: permissionId
        };

        const res = await httpRequestWithAuth.post<ApiResponse<any>>(`${BASE_URL}/remove-from-user`, body, setLoading);
        return res;
    }

    async getUserPermissions(userId: number, setLoading?: SetStateFn): Promise<ApiResponse<PermissionModel[]>> {
        const res = await httpRequestWithAuth.get<ApiResponse<any>>(`${BASE_URL}/user/${userId}`, setLoading);
        return transformApiData(res, (data) => adaptUserPermissionsResponse(data?.data ?? data ?? []));
    }
}
