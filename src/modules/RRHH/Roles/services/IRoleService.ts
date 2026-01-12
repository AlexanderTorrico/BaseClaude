import { RoleModel } from '../models/RoleModel';
import { SetStateFn } from '@/shared/types/commonTypes';
import { ApiResponse } from '@/shared/types';

/**
 * Interfaz del servicio de roles
 * Todos los métodos retornan ApiResponse<T> = { status, message, data }
 * Los errores se manejan internamente en httpService
 */
export interface IRoleService {
    /**
     * Obtiene todos los roles
     * @returns {status: 200, message: 'Success', data: RoleModel[]} en éxito
     * @returns {status: 4xx/5xx, message: string, data: []} en error
     */
    getAllRoles(setLoading?: SetStateFn): Promise<ApiResponse<RoleModel[]>>;

    /**
     * Obtiene un rol por ID
     * @param roleId - ID del rol a obtener
     * @param setLoading - Opcional callback para estado de carga
     * @returns {status: 200, message: 'Success', data: RoleModel} en éxito
     * @returns {status: 4xx/5xx, message: string, data: null} en error
     */
    getRoleById(roleId: number, setLoading?: SetStateFn): Promise<ApiResponse<RoleModel | null>>;

    /**
     * Crea un nuevo rol
     * @param name - Nombre del rol
     * @param detail - Descripción del rol
     * @param setLoading - Opcional callback para estado de carga
     * @returns {status: 200, message: 'Success', data: RoleModel} en éxito
     * @returns {status: 4xx/5xx, message: string, data: null} en error
     */
    createRole(name: string, detail: string, setLoading?: SetStateFn): Promise<ApiResponse<RoleModel | null>>;

    /**
     * Actualiza un rol existente
     * @param roleId - ID del rol a actualizar
     * @param name - Nuevo nombre del rol
     * @param detail - Nueva descripción del rol
     * @param setLoading - Opcional callback para estado de carga
     * @returns {status: 200, message: 'Success', data: RoleModel} en éxito
     * @returns {status: 4xx/5xx, message: string, data: null} en error
     */
    updateRole(roleId: number, name: string, detail: string, setLoading?: SetStateFn): Promise<ApiResponse<RoleModel | null>>;

    /**
     * Elimina un rol
     * @param roleId - ID del rol a eliminar
     * @param setLoading - Opcional callback para estado de carga
     * @returns {status: 200, message: 'Success', data: true} en éxito
     * @returns {status: 4xx/5xx, message: string, data: false} en error
     */
    deleteRole(roleId: number, setLoading?: SetStateFn): Promise<ApiResponse<boolean>>;
}
