import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { PermissionApiService } from '@/modules/RRHH/Permissions/services/PermissionApiService';
import { PermissionModel } from '@/modules/RRHH/Permissions/models/PermissionModel';
import { selectUser } from '@/pages/Login/slices';

const permissionService = new PermissionApiService();

export interface UseUserPermissionsReturn {
    permissions: PermissionModel[];
    permissionNames: string[];
    loading: boolean;
    hasPermission: (permissionName: string) => boolean;
    hasAnyPermission: (permissionNames: string[]) => boolean;
    hasAllPermissions: (permissionNames: string[]) => boolean;
    refreshPermissions: () => Promise<void>;
}

/**
 * Obtiene el usuario del localStorage como fallback
 */
const getUserFromStorage = (): any => {
    try {
        const userData = localStorage.getItem('authUser');
        if (userData) {
            return JSON.parse(userData);
        }
    } catch (error) {
        console.error('Error parsing authUser from localStorage:', error);
    }
    return null;
};

/**
 * Hook para obtener y verificar permisos del usuario logueado
 * 
 * @example
 * ```tsx
 * const { hasPermission, permissionNames } = useUserPermissions();
 * 
 * // Verificar un permiso específico
 * if (hasPermission('user.edit')) {
 *   // Mostrar botón de editar
 * }
 * ```
 */
export const useUserPermissions = (): UseUserPermissionsReturn => {
    const [permissions, setPermissions] = useState<PermissionModel[]>([]);
    const [loading, setLoading] = useState(false);

    // Obtener el usuario del estado de autenticación o localStorage
    const userFromRedux = useSelector(selectUser);
    const user = userFromRedux || getUserFromStorage();

    // Obtener el UUID del usuario (puede venir como 'uuid' o 'id' dependiendo del formato)
    const userUuid = user?.uuid || user?.id;

    const fetchPermissions = useCallback(async () => {
        if (!userUuid) {
            setPermissions([]);
            return;
        }

        setLoading(true);
        try {
            const result = await permissionService.getUserPermissions(userUuid);
            if (result.data) {
                setPermissions(result.data);
            } else {
                setPermissions([]);
            }
        } catch (error) {
            console.error('Error fetching user permissions:', error);
            setPermissions([]);
        } finally {
            setLoading(false);
        }
    }, [userUuid]);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    // Lista de nombres de permisos para verificación rápida
    const permissionNames = permissions.map(p => p.name);

    /**
     * Verifica si el usuario tiene un permiso específico
     */
    const hasPermission = useCallback((permissionName: string): boolean => {
        return permissionNames.includes(permissionName);
    }, [permissionNames]);

    /**
     * Verifica si el usuario tiene al menos uno de los permisos
     */
    const hasAnyPermission = useCallback((names: string[]): boolean => {
        if (names.length === 0) return true;
        return names.some(name => permissionNames.includes(name));
    }, [permissionNames]);

    /**
     * Verifica si el usuario tiene todos los permisos
     */
    const hasAllPermissions = useCallback((names: string[]): boolean => {
        if (names.length === 0) return true;
        return names.every(name => permissionNames.includes(name));
    }, [permissionNames]);

    return {
        permissions,
        permissionNames,
        loading,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        refreshPermissions: fetchPermissions,
    };
};
