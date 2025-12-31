import { RoleModel } from '../models/RoleModel';
import { PermissionModel } from '../models/PermissionModel';

/**
 * Adapta un permiso de la API al modelo de la UI
 */
const adaptPermission = (permission: any): PermissionModel => {
    return {
        id: permission.id,
        name: permission.name || '',
        description: permission.description || '',
        module: permission.module || ''
    };
};

/**
 * Adapta la respuesta de la API al modelo de rol de la UI
 */
export const adaptRoleResponseToRoleModel = (apiRole: any): RoleModel => {
    return {
        id: apiRole.id,
        name: apiRole.name || '',
        detail: apiRole.detail || apiRole.description || '',
        permissionIds: apiRole.permissionIds || apiRole.permission_ids || [],
        permissions: (apiRole.permissions || []).map(adaptPermission),
        createdAt: apiRole.created_at || apiRole.createdAt,
        updatedAt: apiRole.updated_at || apiRole.updatedAt
    };
};

/**
 * Adapta un array de roles de la API
 */
export const adaptRolesArrayToRoleModels = (apiRoles: any[]): RoleModel[] => {
    if (!Array.isArray(apiRoles)) {
        return [];
    }
    return apiRoles.map(adaptRoleResponseToRoleModel);
};

/**
 * Adapta los datos del formulario de creación al modelo RoleModel
 */
export const adaptCreateResponseToRoleModel = (
    name: string,
    detail: string,
    apiData: any
): RoleModel => {
    const roleData = apiData?.data || apiData;

    return {
        id: roleData?.id || Date.now(),
        name: name,
        detail: detail,
        permissionIds: roleData?.permissionIds || roleData?.permission_ids || [],
        permissions: (roleData?.permissions || []).map(adaptPermission),
        createdAt: roleData?.created_at || roleData?.createdAt,
        updatedAt: roleData?.updated_at || roleData?.updatedAt
    };
};
