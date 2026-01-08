import { IRoleService } from './IRoleService';
import { RoleModel } from '../models/RoleModel';
import { adaptRoleResponseToRoleModel, adaptRolesArrayToRoleModels } from '../adapters/roleAdapter';
import { httpRequestWithAuth } from '@/services/httpService';
import { ApiResponse, transformApiData } from '@/shared/types';
import { SetStateFn } from '@/shared/types/commonTypes';

const BASE_URL = '/api/role-permission/roles';

export class RoleApiService implements IRoleService {

    async getAllRoles(setLoading?: SetStateFn): Promise<ApiResponse<RoleModel[]>> {
        const res = await httpRequestWithAuth.get<ApiResponse<any>>(BASE_URL, setLoading);
        return transformApiData(res, (data) => adaptRolesArrayToRoleModels(data?.data ?? data ?? []));
    }

    async getRoleById(roleId: number, setLoading?: SetStateFn): Promise<ApiResponse<RoleModel | null>> {
        const res = await httpRequestWithAuth.get<ApiResponse<any>>(`${BASE_URL}/${roleId}`, setLoading);
        return transformApiData(res, (data) => data ? adaptRoleResponseToRoleModel(data?.data ?? data) : null);
    }

    async createRole(name: string, detail: string, setLoading?: SetStateFn): Promise<ApiResponse<RoleModel | null>> {
        const res = await httpRequestWithAuth.post<ApiResponse<any>>(`${BASE_URL}/`, { name, detail }, setLoading);
        return transformApiData(res, (data) => data ? adaptRoleResponseToRoleModel(data?.data ?? data) : null);
    }

    async updateRole(roleId: number, name: string, detail: string, setLoading?: SetStateFn): Promise<ApiResponse<RoleModel | null>> {
        const res = await httpRequestWithAuth.put<ApiResponse<any>>(`${BASE_URL}/${roleId}`, { name, detail }, setLoading);
        return transformApiData(res, (data) => data ? adaptRoleResponseToRoleModel(data?.data ?? data) : null);
    }

    async deleteRole(roleId: number, setLoading?: SetStateFn): Promise<ApiResponse<boolean>> {
        const res = await httpRequestWithAuth.delete<ApiResponse<any>>(`${BASE_URL}/${roleId}`, setLoading);
        return transformApiData(res, () => res.status === 200);
    }

    /**
     * Asignar un rol a un usuario
     */
    async assignRoleToUser(roleId: number, userId: number, setLoading?: SetStateFn): Promise<ApiResponse<any>> {
        const res = await httpRequestWithAuth.post<ApiResponse<any>>(
            '/api/role-permission/role-users/assign',
            { gbl_role_id: roleId, gbl_user_id: userId },
            setLoading
        );
        return res;
    }

    /**
     * Remover un rol de un usuario
     */
    async removeRoleFromUser(roleId: number, userId: number, setLoading?: SetStateFn): Promise<ApiResponse<any>> {
        const res = await httpRequestWithAuth.post<ApiResponse<any>>(
            '/api/role-permission/role-users/remove',
            { gbl_role_id: roleId, gbl_user_id: userId },
            setLoading
        );
        return res;
    }
}
