import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PermissionApiService } from '@/modules/RRHH/Permissions/services/PermissionApiService';
import { selectUser } from '@/pages/Login/slices';

interface ProtectedRouteProps {
    children: React.ReactNode;
    permissions?: string[];  // Permisos requeridos (cualquiera de ellos)
    redirectTo?: string;     // Ruta de redirección si no tiene permiso
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

const permissionService = new PermissionApiService();

/**
 * Componente para proteger rutas según permisos del usuario.
 * Espera a que los permisos se carguen antes de decidir si redirigir.
 * 
 * @example
 * ```tsx
 * <ProtectedRoute permissions={['user.edit', 'user.delete']}>
 *   <UserEditPage />
 * </ProtectedRoute>
 * ```
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    permissions = [],
    redirectTo = '/dashboard'
}) => {
    const [permissionNames, setPermissionNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasChecked, setHasChecked] = useState(false);

    // Obtener el usuario
    const userFromRedux = useSelector(selectUser);
    const user = userFromRedux || getUserFromStorage();

    // Obtener el UUID del usuario (puede venir como 'uuid' o 'id')
    const userUuid = user?.uuid || user?.id;

    useEffect(() => {
        const loadPermissions = async () => {
            if (!userUuid) {
                setLoading(false);
                setHasChecked(true);
                return;
            }

            try {
                const result = await permissionService.getUserPermissions(userUuid);
                if (result.data) {
                    const names = result.data.map(p => p.name);
                    setPermissionNames(names);
                }
            } catch (error) {
                console.error('ProtectedRoute - Error loading permissions:', error);
            } finally {
                setLoading(false);
                setHasChecked(true);
            }
        };

        loadPermissions();
    }, [user?.id]);

    // Mientras carga, mostrar spinner centrado en la pantalla
    if (loading || !hasChecked) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{
                    position: 'fixed',
                    top: '70px',
                    left: '250px',
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 1000
                }}
            >
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2 text-muted">Verificando permisos...</p>
                </div>
            </div>
        );
    }

    // Si no hay permisos requeridos, permitir acceso
    if (permissions.length === 0) {
        return <>{children}</>;
    }

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    const hasPermission = permissions.some(perm => permissionNames.includes(perm));

    if (!hasPermission) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
