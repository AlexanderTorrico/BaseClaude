import { PermissionModel } from '../models/PermissionModel';
import { ModuleModel } from '../models/ModuleModel';

/**
 * Adapta un módulo de la API al modelo de la UI
 */
const adaptModuleResponseToModel = (apiModule: any): ModuleModel | undefined => {
    if (!apiModule) return undefined;

    return {
        id: apiModule.id,
        name: apiModule.name || '',
        description: apiModule.description || '',
        icon: apiModule.icon || '',
        path: apiModule.path || '',
        color: apiModule.color || '',
        img: apiModule.img || ''
    };
};

/**
 * Adapta la respuesta de la API al modelo de permiso de la UI
 */
export const adaptPermissionResponseToModel = (apiPermission: any): PermissionModel => {
    const result: PermissionModel = {
        id: apiPermission.id,
        name: apiPermission.name || '',
        namePublic: apiPermission.name_public || apiPermission.namePublic || '',
        description: apiPermission.description || '',
        createdAt: apiPermission.created_at || apiPermission.createdAt,
        updatedAt: apiPermission.updated_at || apiPermission.updatedAt
    };

    if (apiPermission.gbl_module_id || apiPermission.gblModuleId) {
        result.gblModuleId = apiPermission.gbl_module_id || apiPermission.gblModuleId;
    }

    const module = adaptModuleResponseToModel(apiPermission.module);
    if (module) {
        result.module = module;
    }

    return result;
};

/**
 * Adapta un array de permisos de la API
 */
export const adaptPermissionsArrayToModels = (apiPermissions: any[]): PermissionModel[] => {
    if (!Array.isArray(apiPermissions)) {
        return [];
    }
    return apiPermissions.map(adaptPermissionResponseToModel);
};

/**
 * Adapta la respuesta del endpoint /permissions/user/{id}
 * La respuesta tiene estructura diferente con el permiso anidado en "permission"
 */
export const adaptUserPermissionsResponse = (apiUserPermissions: any[]): PermissionModel[] => {
    
    if (!Array.isArray(apiUserPermissions)) {
        console.warn('⚠️ apiUserPermissions is not an array:', apiUserPermissions);
        return [];
    }

    const result = apiUserPermissions.map(item => {
        const permission = item.permission || item;

        const adapted: PermissionModel = {
            id: permission.id,
            name: permission.name || '',
            namePublic: permission.name_public || permission.namePublic || '',
            description: permission.description || '',
        };

        if (permission.gbl_module_id || permission.gblModuleId) {
            adapted.gblModuleId = permission.gbl_module_id || permission.gblModuleId;
        }

        // El módulo generalmente viene en el item padre, no en permission
        const moduleData = item.module || permission.module;
        if (moduleData) {
            adapted.module = {
                id: moduleData.id,
                name: moduleData.name || '',
                description: moduleData.description || '',
                icon: moduleData.icon || '',
                path: moduleData.path || '',
                color: moduleData.color || '',
                img: moduleData.img || ''
            };
        }

        return adapted;
    });

    return result;
};
